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
		label: 'Board',
		icon: <FontIcon className="material-icons" color="#fff">list</FontIcon>,
		link: '/boards',
	},
	{
		label: 'Groups',
		icon: <FontIcon className="material-icons" color="#fff">group_work</FontIcon>,
		link: '/groups',
	},
	{
		label: 'Messages',
		icon: <FontIcon className="material-icons" color="#fff">chat</FontIcon>,
		link: '/messages',
	},
	{
		label: 'Notifications',
		icon: <FontIcon className="material-icons" color="#fff">notifications</FontIcon>,
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
			showHeader: true,
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
				[css['hide-top']]: !this.state.showHeader,
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
				<div style={{height:4000}}>padding</div>
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
		const showHeader = top === 0;
		if (this.state.showHeader !== showHeader) {
			this.setState({ showHeader });
		}
	} else if (!this.state.showHeader) {
		this.setState({ showHeader: true });
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
