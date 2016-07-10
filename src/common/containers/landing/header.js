import React, { Component, PropTypes } from 'react';
import { injectIntl, defineMessages } from 'react-intl';
import { Link } from 'react-router';
import cx from 'classnames';
import FlatButton from 'material-ui/FlatButton';
import pure from 'recompose/pure';
import css from './header.scss';

const messages = defineMessages({
	quote: {
		id: 'app.landing.header.quote',
		description: 'Intro text on Landing Page',
		defaultMessage: 'Organize your thinking with Seanote',
	},
	learnMore: {
		id: 'app.landing.header.learn_more',
		description: 'label for `Learn More` Button',
		defaultMessage: 'Learn More',
	},
	signIn: {
		id: 'app.landing.header.sign_in',
		description: 'label for `Sign In` Button',
		defaultMessage: 'Sign in',
	},
});

@injectIntl
class Header extends Component {
	static propTypes = {
		shrink: PropTypes.bool,
	};
	render() {
		const { intl } = this.props;
		const buttonProps = {
			backgroundColor: '#37474f',
			labelStyle: {color: '#fff'},
			style: {
				width: 240
			},
		};
		return (
			<header className={cx(css.root, {
				[css.shrink]: this.props.shrink
			})}>
				<h1><Link to="/">Seanote</Link></h1>
				<div className={css.text}>
					<p className={css.quote}>
						{intl.formatMessage(messages.quote)}
					</p>
					<div className={css['row-double']}>
						<Link to="/about">
							<FlatButton {...buttonProps}
								label={intl.formatMessage(messages.learnMore)}
							/>
						</Link>
					</div>
					<div className={css.row}>
						<Link to="/signin">
							<FlatButton {...buttonProps}
								label={intl.formatMessage(messages.signIn)}
							/>
						</Link>
					</div>
				</div>
			</header>
		);
	}
}

export default pure(Header);
