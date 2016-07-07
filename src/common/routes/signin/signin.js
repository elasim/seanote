import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { defineMessages, injectIntl } from 'react-intl';
import TextField from 'material-ui/TextField';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';

import css from './signin.scss';

const messages = defineMessages({
	username: {
		id: 'app.signin.username',
		description: 'label for Username field',
		defaultMessage: 'Username',
	},
	password: {
		id: 'app.signin.password',
		description: 'label for Password field',
		defaultMessage: 'Password'
	},
	signin: {
		id: 'app.signin.submit',
		description: 'label for `Sign-in with Seanote` Button',
		defaultMessage: 'Sign-in with Seanote'
	},
	findPassword: {
		id: 'app.signin.find_password',
		description: 'label for `I lost my password` Button',
		defaultMessage: 'I lost my password',
	},
	aboutSocialLogin: {
		id: 'app.signin.can_social_login',
		description: 'Explain about Social Login',
		defaultMessage: 'Sign in with SNS',
	},
	withFB: {
		id: 'app.signin.with_fb',
		description: 'label for `Sign-in with Facebook` Button',
		defaultMessage: 'Sign-in with Facebook',
	},
	withGoogle: {
		id: 'app.signin.with_google',
		description: 'label for `Sign-in with Google` Button',
		defaultMessage: 'Sign-in with Google',
	},
	withTwitter: {
		id: 'app.signin.with_twitter',
		description: 'label for `Sign-in with Twitter` Button',
		defaultMessage: 'Sign-in with Twitter',
	},
});


const oauths = [
	{
		label: messages.withFB,
		link: '/auth/fb',
		icon: 'fa-facebook',
		color: '#fff',
		backgroundColor: '#3b5998',
	},
	{
		label: messages.withGoogle,
		link: '/auth/google',
		icon: 'fa-google',
		color: '#fff',
		backgroundColor: '#d62d20',
	},
	{
		label: messages.withTwitter,
		link: '/auth/twitter',
		icon: 'fa-twitter',
		color: '#fff',
		backgroundColor: '#00aced'
	},
];

@injectIntl
export default class SignInView extends Component {
	static contextTypes = {
		setTitle: PropTypes.func.isRequired,
	};
	render() {
		const { intl } = this.props;
		const textfieldProps = {
			fullWidth: true,
			underlineFocusStyle: {
				borderColor: '#01579B'
			},
		};
		const buttonProps = {
			className: css.button,
		};
		const oauthButtons = oauths.map(oauth => (
			<RaisedButton label={intl.formatMessage(oauth.label)}
				backgroundColor={oauth.backgroundColor}
				labelColor={oauth.color}
				icon={<FontIcon className={`fa ${oauth.icon}`}/>}
				linkButton={true}
				href={oauth.link}
				{...buttonProps} />
		));
		return (
			<div className={css.root}>
				<section className={css.section}>
					<h2>Sign-in with Seanote</h2>
					<form method="post" action="/auth/local">
						<div className={css.row}>
							<TextField hintText={intl.formatMessage(messages.username)}
								{...textfieldProps} />
							<TextField hintText={intl.formatMessage(messages.password)}
								type="password" {...textfieldProps} />
						</div>
						<RaisedButton type="submit"
							label={intl.formatMessage(messages.signin)}
							{...buttonProps} />
						<RaisedButton type="button"
							label={intl.formatMessage(messages.findPassword)}
							{...buttonProps} />
					</form>
				</section>
				<section className={css.section}>
					<h2>{intl.formatMessage(messages.aboutSocialLogin)}</h2>
					{oauthButtons}
				</section>
			</div>
		);
	}
	componentWillMount() {
		this.context.setTitle('Sign-In');
	}
	componentDidMount() {
		window.scrollTo(0, 1);
	}
}
