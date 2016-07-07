import cx from 'classnames';
import React, { Component, PropTypes } from 'react';
import {
	Textfield,
	Button,
	Icon
} from 'react-mdl';

import css from './style.css';
import User from '../../data/user';

const FIELD_EMAIL = 'email';
const FIELD_PASSWORD = 'password';

const ErrorString = {
	EmailRequired: 'Please enter your Email account',
	PasswordRequired: 'Please enter password'
};

export default class SigninForm extends Component {
	static propTypes = {
		onSuccess: PropTypes.func.isRequired,
		onFailure: PropTypes.func,
		redirect: PropTypes.string,
	};
	static defaultProps = {
		onFailure: () => {}
	}
	constructor(props, context) {
		super(props, context);
		this.state = {
			sent: false,
			error: undefined,
		};
	}
	onSubmit(e) {
		e.preventDefault();
		const { onSuccess, onFailure } = this.props;
		const form = e.target;
		const inputEmail = form[FIELD_EMAIL];
		const inputPassword = form[FIELD_PASSWORD];

		if (!inputEmail.value
			|| String(inputEmail.value).trim().length === 0)
		{
			inputEmail.value.select();
			this.setState({
				error: ErrorString.EmailRequired
			});
			return;
		}
		if (!inputPassword.value
			|| String(inputPassword.value).trim().length === 0)
		{
			inputPassword.select();
			this.setState({
				error: ErrorString.PasswordRequired
			});
			return;
		}
		this.setState({
			error: undefined,
			sent: true
		});
		User.signIn(inputEmail.value, inputPassword.value)
			.then(onSuccess)
			.catch(e => {
				console.error(e);
				this.setState({
					error: e.message,
					sent: false
				});
				onFailure(e);
			});
	}
	render() {
		const errorStyle = cx(css.error, {
			[css.visible]: !!this.state.error
		});
		return (
			<div className={css.root}>
				<form method="post" onSubmit={::this.onSubmit}>
					<div className={errorStyle}>{this.state.error||' '}</div>
					<Textfield type="email" name={FIELD_EMAIL} label="Email"
						disabled={this.state.sent} className={css.row}
						ref={FIELD_EMAIL}/>
					<Textfield type="password" name={FIELD_PASSWORD} label="Password"
						disabled={this.state.sent} className={css.row}
						ref={FIELD_PASSWORD}/>
					<div className={css.row}>
						<Button type="submit" raised colored className={css.stretch}
							disabled={this.state.sent}>
							<Icon name="vpn_key" /> Sign-In
						</Button>
					</div>
				</form>
			</div>
		);
	}
}
