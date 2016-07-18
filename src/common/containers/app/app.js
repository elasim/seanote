import cx from 'classnames';
import React, { Component, PropTypes } from 'react';
import Header from './components/header';
import Nav from './components/nav';
import Dim from './components/dim';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import css from './styles/app.scss';
import messages from './define-messages';
import {
	createScrollSpy,
	createResizeSpy,
	getViewportHeight,
} from '../../lib/dom-helpers';

export default class App extends Component {
	static contextTypes = {
		setTitle: PropTypes.func,
	};
	constructor(...args) {
		super(...args);

		this.onMessage = this::onMessage;
		this.state = {
			showDrawer: false,
		};
	}
	componentWillMount() {
		this.context.setTitle('Seanote');
	}
	componentDidMount() {
		const _adjustLayout = this::adjustLayout;
		this.scrollSpy = createScrollSpy(_adjustLayout);
		this.resizeSpy = createResizeSpy(_adjustLayout, getViewportHeight);
		_adjustLayout();
	}
	componentWillUnmount() {
		if (this.scrollSpy) {
			this.scrollSpy.dispose();
		}
		if (this.resizeSpy) {
			this.resizeSpy.dispose();
		}
	}
	render() {
		const { headerVisibility, dim } = this.props;
		const { showDrawer } = this.state;
		return (
			<div className={cx(css.root, {
				[css['hide-top']]: !headerVisibility,
				[css['hide-drawer']]: !showDrawer,
			})}>
				<Header className={css.header} onMessage={this.onMessage} />
				<div className={cx(css.drawer)}>
					<List>
						<Subheader>USER NAME</Subheader>
						<ListItem primaryText="Setting"/>
						<ListItem primaryText="Logout"/>
						<Subheader>Developer</Subheader>
						<ListItem primaryText="Prefetch" onClick={this.props.prefetch}/>
						<ListItem primaryText="ver.20160719.nightly"/>
						<Subheader>Supports</Subheader>
						<ListItem primaryText="Feedback"/>
						<ListItem primaryText="Help"/>
					</List>
				</div>
				<Dim active={!!dim} {...dim} />
				<Nav className={css.nav} />
				{this.props.children}
			</div>
		);
	}
}

function onMessage(event) {
	switch (event) {
		case Header.EventTypes.leftButtonClick:
			return this::openDrawer();
	}
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

function openDrawer() {
	this.props.setDim({ onClick: (this::closeDrawer) });
	this.setState({ showDrawer: true });
}

function closeDrawer() {
	this.props.setDim(null);
	this.setState({ showDrawer: false });
}
