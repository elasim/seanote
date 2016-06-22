import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import {
	Textfield,
	Button,
	Icon
} from 'react-mdl';
import css from './style.css';
import User from '../user-mock.js';

const FIELD_EMAIL = 'email';
const FIELD_USERNAME = 'username';
const FIELD_PASSWORD = 'password';
const FIELD_PASSWORD_CONFIRM = 'passwordConfirm';

const ErrorString = {
	UsernameUnavailable: 'Username already in use',
	EmailUnavailable: 'Email already in use',
	PasswordMismatch: 'Password and confirm are mismatched',
};

export default class SignupForm extends Component {
	static propTypes = {
		api: PropTypes.string.isRequired,
		onSuccess: PropTypes.func.isRequired,
		onFailure: PropTypes.func
	};
	static defaultProps = {
		onFailure: () => {}
	};
	constructor(props, context) {
		super(props, context);
		this.state = {
			validation: {
				usernameError: undefined,
				emailError: undefined,
				passwordError: undefined,
				valid: false,
			},
			sent: false,
		};
	}
	componentDidMount() {
		this._onSubmit = ::this.onSubmit;
	}
	onSubmit(e) {
		const { onSuccess, onFailure } = this.props;
		const form = e.target;
		const email = form[FIELD_EMAIL];
		const username = form[FIELD_USERNAME];
		const password = form[FIELD_PASSWORD];
		e.preventDefault();
		this.setState({ sent: true });
		User.signUp({
			email: email.value,
			username: username.value,
			password: password.value
		})
			.then(onSuccess)
			.catch(e => {
				this.setState({
					sent: false
				});
				onFailure(e);
			});
		return false;
	}
	async onChangeValue(e) {
		this.setState({
			validation: await this.validateForm(e.target)
		});
	}
	async validateForm(field) {
		const { validation } = this.state;
		switch (field.name) {
			case FIELD_EMAIL: {
				if (await User.isAvailableEmail(field.value) !== true) {
					validation.emailError = ErrorString.EmailUnavailable;
				}
				validation.emailError = undefined;
				break;
			}
			case FIELD_PASSWORD:
			case FIELD_PASSWORD_CONFIRM: {
				const passwd = findDOMNode(this.refs.password)
					.querySelector('input');
				const passConfirm = findDOMNode(this.refs.passwordConfirm)
					.querySelector('input');
				if (passwd.value !== passConfirm.value) {
					validation.passwordError = ErrorString.PasswordMismatch;
					break;
				}
				if (passwd.value.length === 0) {
					validation.passwordError = ErrorString.PasswordEmpty;
					break;
				}
				validation.passwordError = undefined;
				break;
			}
			case FIELD_USERNAME: {
				if (await User.isAvailableName(field.value) !== true) {
					validation.usernameError = ErrorString.UsernameUnavailable;
				}
				validation.usernameError = undefined;
				break;
			}
		}
		validation.valid = Object.keys(validation)
		.map(key => !validation[key])
			.reduce((prev, current) => prev & current);
		return validation;
	}
	render() {
		const canSubmit = this.state.validation.valid && !this.state.sent;
		return (
			<div className={css.root}>
				<form method="post" onSubmit={this._onSubmit}>
					<Textfield floatingLabel className="row"
						ref="email" type="email" label="Email"
						name={FIELD_EMAIL}
						error={this.state.validation.emailError}
						onChange={::this.onChangeValue}
						disabled={this.state.sent}
					/>
					<Textfield floatingLabel className="row"
						ref="username" label="Username"
						name={FIELD_USERNAME}
						error={this.state.validation.usernameError}
						onChange={::this.onChangeValue}
						disabled={this.state.sent}
					/>
					<Textfield floatingLabel className="row" ref="password"
						type="password" label="Password"
						name={FIELD_PASSWORD}
						error={this.state.validation.passwordError}
						onChange={::this.onChangeValue}
						disabled={this.state.sent}
					/>
					<Textfield floatingLabel className="row" ref="passwordConfirm"
						type="password" label="Password Confirm"
						name={FIELD_PASSWORD_CONFIRM}
						error={this.state.validation.passwordError}
						onChange={::this.onChangeValue}
						disabled={this.state.sent}
					/>
					<div className={css.center}>
						<Button type="submit"
							ripple accent disabled={!canSubmit} >
							<Icon name="done" />
						</Button>
					</div>
				</form>
			</div>
		);
	}
}
