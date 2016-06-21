import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
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
			valid: false,
			sent: false,
			usernameError: undefined,
			emailError: undefined,
			passwordError: undefined,
			values: {}
		};
	}
	componentDidMount() {
		this._onSubmit = ::this.onSubmit;
	}
	onSubmit(e) {
		e.preventDefault();		
		const { onSuccess, onFailure } = this.props;
		this.setState({
			sent: true
		});
		User.signUp({
			email: this.state.values[FIELD_EMAIL],
			username: this.state.values[FIELD_USERNAME],
			password: this.state.values[FIELD_PASSWORD]
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
		const { name, value } = e.currentTarget;
		const state = this.state;
		switch (name) {
			case FIELD_PASSWORD:
			case FIELD_PASSWORD_CONFIRM:
			case FIELD_EMAIL:
			case FIELD_USERNAME:
				state.values[name] = value;
				break;
			default:
				console.error('unknown input field');
				return;
		}
		const validation = await this.validateForm();
		Object.assign(this.state, validation);
		this.setState(this.state);
	}
	async validateForm() {
		const { values } = this.state;
		let usernameError;
		let passwordError;
		let emailError;
		// password validation
		if (values[FIELD_PASSWORD] !== values[FIELD_PASSWORD_CONFIRM]) {
			passwordError = ErrorString.PasswordMismatch;
		}
		// username validation
		if (await User.isAvailableName(values[FIELD_USERNAME]) !== true) {
			usernameError = ErrorString.UsernameUnavailable;
		}
		// email validation
		if (await User.isAvailableEmail(values[FIELD_EMAIL]) !== true) {
			emailError = ErrorString.EmailUnavailable;
		}
		return {
			usernameError,
			passwordError,
			emailError,
			valid: (!usernameError && !passwordError && !emailError)
		};
	}
	render() {
		const canSubmit = this.state.valid && !this.state.sent;
		return (
			<div className={css.root}>
				<form method="post" onSubmit={this._onSubmit}>
					<Textfield floatingLabel className="row"
						ref="email" type="email" label="Email" name={FIELD_EMAIL}
						error={this.state.emailError}
						onChange={::this.onChangeValue}
						disabled={this.state.sent}
					/>
					<Textfield floatingLabel className="row"
						ref="username" label="Username" name={FIELD_USERNAME}
						error={this.state.usernameError}
						onChange={::this.onChangeValue}
						disabled={this.state.sent}
					/>
					<Textfield floatingLabel className="row"
						type="password" label="Password" name={FIELD_PASSWORD}
						error={this.state.passwordError}
						onChange={::this.onChangeValue}
						disabled={this.state.sent}
					/>
					<Textfield floatingLabel className="row"
						type="password" label="Password Confirm"
						error={this.state.passwordError} name={FIELD_PASSWORD_CONFIRM}
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
