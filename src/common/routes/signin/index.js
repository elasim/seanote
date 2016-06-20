import React, { Component } from 'react';
import SignupForm from '../../components/signup-form';
import SigninForm from '../../components/signin-form';

import {
	Grid,
	Cell
} from 'react-mdl';

export default class SignIn extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			showSignUp: false
		};
	}
	onSuccess() {
		console.log('Success');
	}
	onSignUpCancelled() {
		this.setState({
			showSignUp: false
		});
	}
	render() {
		let controls;
		if (this.state.showSignUp) {
			controls = (
				<SignupForm
					onSuccess={::this.onSuccess}
					onCancelled={::this.onSignUpCancelled}
				/>
			);
		} else {
			controls = (
				<SigninForm onSuccess={::this.onSuccess} />
			);
		}
		return (
			<div className="mdl-layout__content">
				<Grid>
					<Cell col={4}>
						Some Description Here
					</Cell>
					<Cell col={4}>
						<div>{controls}</div>
					</Cell>
				</Grid>
			</div>
		);
	}
}
