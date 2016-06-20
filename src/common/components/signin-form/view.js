import cx from 'classnames';
import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import {
	Textfield,
	Button,
	Icon
} from 'react-mdl';

import './style.css';
import User from '../user-mock.js';

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
	};
	static defaultProps = {
		onFailure: () => {}
	}
	constructor(props, context) {
		super(props, context);
		this.state = {
			sent: false,
			error: undefined,
			values: {}
		};
	}
	onChangeValue(e) {
		const { name, value } = e.target;
		switch (name) {
			case FIELD_EMAIL:
			case FIELD_PASSWORD:
				this.state.values[name] = value;
				break;
			default:
				console.error('unknown field input');
		}
		this.setState(this.state);
		console.log(this.state);
	}
	onSubmit(e) {
		e.preventDefault();
		const { onSuccess, onFailure } = this.props;
		const email = this.state.values[FIELD_EMAIL];
		const password = this.state.values[FIELD_PASSWORD];		
		if (!email || String(email).trim().length === 0) {
			findDOMNode(this.refs[FIELD_EMAIL]).querySelector('input').focus();
			this.setState({
				error: ErrorString.EmailRequired
			});
			return;
		}
		if (!password || String(password).trim().length === 0) {
			findDOMNode(this.refs[FIELD_PASSWORD]).querySelector('input').focus();
			this.setState({
				error: ErrorString.PasswordRequired
			});
			return;
		}
		this.setState({
			error: undefined,
			sent: true
		});
		User.signIn({
			email,
			password
		})
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
		const errorStyle = cx('error', {
			'visible': !!this.state.error
		});
		return (
			<div className="control signin-form">
				<form method="post" onSubmit={::this.onSubmit}>
					<div className={errorStyle}>{this.state.error||' '}</div>
					<Textfield type="email" name={FIELD_EMAIL} label="Email"
						onChange={::this.onChangeValue} disabled={this.state.sent}
						className="row" ref={FIELD_EMAIL}/>
					<Textfield type="password" name={FIELD_PASSWORD} label="Password"
						onChange={::this.onChangeValue} disabled={this.state.sent}
						className="row" ref={FIELD_PASSWORD}/>
					<div className="row">
						<Button type="submit" raised colored className="stretch"
							disabled={this.state.sent}>
							<Icon name="vpn_key" /> Sign-In
						</Button>
					</div>
				</form>
			</div>
		);
	}
}
