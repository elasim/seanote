import Rx from 'rx';
import cx from 'classnames';
import React, { Component, PropTypes } from 'react';
import { defineMessages } from 'react-intl';
import Header from './header';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import request from '../../lib/request';
import {
	createScrollSpy,
	createResizeSpy,
	getViewportWidth,
	getViewportHeight,
} from '../helpers';
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

const categoryDescriptors = [
	{
		label: 'List',
		icon: {
			className: 'material-icons',
			content: 'list',
		},
	},
	{
		label: 'Groups',
		icon: {
			className: 'material-icons',
			content: 'group_work',
		},
	},
	{
		label: 'Chat',
		icon: {
			className: 'material-icons',
			content: 'chat',
		},
	},
	{
		label: 'Notifications',
		icon: {
			className: 'material-icons',
			content: 'notifications',
		},
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
			shrinkNav: false,
		};
	}
	componentDidMount() {
		// refresh token in a minute
		this.tokenRefresher = createTokenRefresher();

		const _adjustLayout = this::adjustLayout;
		this.scrollSpy = createScrollSpy(_adjustLayout);
		this.heightResizeSpy = createResizeSpy(_adjustLayout, getViewportHeight);
		this.widthResizeSpy = createResizeSpy(this::adjustNavLayout, getViewportWidth);

		_adjustLayout();
		this::adjustNavLayout();
	}
	componentWillUnmount() {
		if (this.tokenRefresher) {
			this.tokenRefresher.dispose();
		}
		if (this.scrollSpy) {
			this.scrollSpy.dispose();
		}
		if (this.widthResizeSpy) {
			this.widthResizeSpy.dispose();
		}
		if (this.heightResizeSpy) {
			this.heightResizeSpy.dispose();
		}
	}
	render() {
		const categories = categoryDescriptors.map((category, i) => {
			let props = {
				className: css.category,
				key: i,
			};
			if (this.state.shrinkNav) {
				props.style = {
					width: `${Math.floor(1 / categoryDescriptors.length * 100)}%`,
				};
			} else {
				props.style = {
					width: '100%'
				};
			}
			return (
				<div {...props}>
					<FlatButton
						icon={<FontIcon color="#fff" className={category.icon.className} >{category.icon.content}</FontIcon>}
						label={!this.state.shrinkNav ? category.label : null}
						labelStyle={{color: '#fff'}}
						style={{
							width: '100%',
							height: 50,
							textAlign: !this.state.shrinkNav ? 'left' : 'center',
						}} />
				{/*
					<FlatButton
						className={css.title}
						style={{
							width: '100%',
							textAlign: !this.state.shrinkNav ? 'left' : 'center',
						}}
					>
						<i className={category.icon.className} >{category.icon.content}</i>
						<span>{category.label}</span>
					</FlatButton>
				*/}
				</div>
			);
		});
		return (
			<div className={cx(css.root, {
				[css['hide-top']]: !this.state.showHeader,
				[css['hide-drawer']]: !this.state.showDrawer,
			})}>
				<Header className={css.header}
					onClickMenu={this::showDrawer}
				/>
				<div className={cx(css.drawer)}>
					DRAWER BOX
				</div>
				<div className={css.dim} onClick={this::hideDrawer}></div>
				<div className={css.nav}>
					{categories}
				</div>
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

function adjustNavLayout() {
	const shrinkNav = document.body.clientWidth <= 600;
	if (this.state.shrinkNav !== shrinkNav) {
		this.setState({ shrinkNav });
	}
}

function createTokenRefresher() {
	return Rx.Observable.interval(1000* 60)
		.subscribe(async () => {
			try {
				const res = await request.get('/api/user');
				const user = await res.json();
				console.log('New token:', user.token);
			} catch (e) {
				console.log('Refreshing token failure');
			}
		});
}

/*
				<Grid className={css.container} noSpacing>
					<Cell col={3} tablet={4} phone={8} hidePhone={!view}
						hideTablet={hide} hideDesktop={hide}
						className={css.list}>
						<BoardList />
					</Cell>
					<Cell col={viewCol.col} tablet={viewCol.tablet} phone={8}
						hidePhone={view} className={css.col}>
						<div className={cx(css.fold, hide ? css['full-width'] : null) }>
							<IconButton name="view_list" onClick={this.onToggleList} />
						</div>
						{this.props.children}
					</Cell>
				</Grid>
*/