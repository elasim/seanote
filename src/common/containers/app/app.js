import Rx from 'rx';
import cx from 'classnames';
import React, { Component, PropTypes } from 'react';
import { defineMessages } from 'react-intl';
import Header from './header';
import Nav from './nav';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import {
	createScrollSpy,
	createResizeSpy,
	getViewportHeight,
} from '../../lib/dom-helpers';
import css from './app.scss';

const messages = defineMessages({
	list: {
		id: 'app.label.list',
		description: 'common word for List',
		defaultMessage: 'List'
	},
	group: {
		id: 'app.label.group',
		description: 'common word for Group',
		defaultMessage: 'Group',
	},
	chat: {
		id: 'app.label.chat',
		description: 'common word for Chat',
		defaultMessage: 'Chat',
	},
	notification: {
		id: 'app.label.notification',
		description: 'common word for Notification',
		defaultMessage: 'Notification',
	},
});

const MENU_ITEMS = [
	{
		label: 'My Boards',
		icon: <FontIcon className="material-icons" color="#fff">&#xE8EF;</FontIcon>,
		link: '/boards',
	},
	{
		label: 'Groups',
		icon: <FontIcon className="material-icons" color="#fff">&#xE886;</FontIcon>,
		link: '/groups',
	},
	{
		label: 'Messages',
		icon: <FontIcon className="material-icons" color="#fff">&#xE0B7;</FontIcon>,
		link: '/messages',
	},
	{
		label: 'Notifications',
		icon: <FontIcon className="material-icons" color="#fff">&#xE7F4;</FontIcon>,
		link: '/notifications',
	}
];

export default class View extends Component {
	static contextTypes = {
		setTitle: PropTypes.func,
	};
	constructor(...args) {
		super(...args);

	}
	componentWillMount() {
		this.context.setTitle('Seanote');
		this.state = {
			showDrawer: false,
		};
	}
	componentDidMount() {
		// refresh token in a minute
		this.tokenRefresher = this::createTokenRefresher();
		this.dataUpdater = this::createDataUpdater();

		const _adjustLayout = this::adjustLayout;
		this.scrollSpy = createScrollSpy(_adjustLayout);
		this.resizeSpy = createResizeSpy(_adjustLayout, getViewportHeight);

		_adjustLayout();
	}
	componentWillUnmount() {
		if (this.tokenRefresher) {
			this.tokenRefresher.dispose();
		}
		if (this.dataUpdater) {
			this.dataUpdater.dispose();
		}
		if (this.scrollSpy) {
			this.scrollSpy.dispose();
		}
		if (this.resizeSpy) {
			this.resizeSpy.dispose();
		}
	}
	render() {
		return (
			<div className={cx(css.root, {
				[css['hide-top']]: !this.props.headerVisibility,
				[css['hide-drawer']]: !this.state.showDrawer,
			})}>
				<Header className={css.header}
					onClickMenu={this::showDrawer}
				/>
				<div className={cx(css.drawer)}>
					<FlatButton onClick={() => this.props.prefetch()} label="Send"/>
				</div>
				<div className={css.dim} onClick={this::hideDrawer}></div>
				<Nav className={css.nav} items={MENU_ITEMS} />
				{this.props.children}
			</div>
		);
	}
}

function showDrawer() {
	this.setState({ showDrawer: true });
}

function hideDrawer() {
	this.setState({ showDrawer: false });
}

function adjustLayout() {
	const top = document.body.scrollTop;

	// portrait or too small to show header
	if (getViewportHeight() <= 400) {
		const headerVisibility = top === 0;
		if (this.props.headerVisibility !== headerVisibility) {
			this.props.setHeaderVisibility(headerVisibility);
		}
	} else if (!this.props.headerVisibility) {
		this.props.setHeaderVisibility(true);
	}
}

// calling whoami api every minutes
// to maintain current user session without request
function createTokenRefresher() {
	return Rx.Observable.interval(1000 * 60)
		.subscribe(() => this.props.acquireToken());
}

// keep up to date
function createDataUpdater() {
	return Rx.Observable.timer(1, 5 * 60 * 1000)
		.timeInterval()
		.subscribe(() => this.props.prefetch());
}
