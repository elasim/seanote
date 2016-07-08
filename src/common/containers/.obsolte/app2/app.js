import React, { Component } from 'react';
import { Link } from 'react-router';
import {
// Header,
	Navigation,
	Drawer,
	Layout,
	Button,
	Textfield,
	Icon,
	Snackbar,
} from 'react-mdl';
import Header from './header';

import css from './style.scss';

export default class App extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			showError: false
		};
	}
	componentWillReceiveProps(nextProps) {
		if (this.props.title !== nextProps.title) {
			document.title = nextProps.title;
		}
		if (this.props.authError !== nextProps.authError) {
			this.setState({
				showError: true,
			});
		}
	}
	componentDidMount() {
		console.log('AppComponent Did Mount');
	}
	componentWillUnmount() {
		console.log('AppComponent will Unmount');
	}
	render() {
		const { contextMenu } = this.props;
		const titleLink = (
			<Link to="/" className={css.title}>
				<Button primary ripple>AcaNote</Button>
			</Link>
		);
		let contextMenuIcon = null;
		let contextMenuAction = null;
		let contextMenuItems = null;
		if (contextMenu) {
			if (contextMenu.items) {
				contextMenuItems = contextMenu.items.map((item, i) => {
					return (
						<Link key={i} to={item.to}>{item.header}</Link>
					);
				});
			}
			contextMenuIcon = contextMenu.icon;
			contextMenuAction = contextMenu.action;
		} else {
			contextMenuItems = [
				<Link key={0} to="/">Home</Link>,
				<Link key={1} to="/about">About</Link>,
				<Link key={5} to="/board">Board</Link>,
				<Link key={3} to="/signin">Sign In</Link>,
				<a key={4} href="https://github.com/elasim" target="_blank">
					<Icon name="link" style={{ marginRight: '8px', verticalAlign: 'middle' }} />
					Github
				</a>
			];
		}
		const header = (
			<Header seamed title={titleLink} className={css.header}
				contextIcon={contextMenuIcon}
				contextAction={contextMenuAction}>
				<Textfield label="Search" expandable expandableIcon="search" />
				<Navigation className={css.navigation}>
					<Link to="/"><Button primary ripple>Home</Button></Link>
					<Link to="/board"><Button primary ripple>Dashboard</Button></Link>
					<Link to="/board/demo"><Button raised accent ripple>demo</Button></Link>
					<Link to="/signin"><Button raised colored ripple>Sign In</Button></Link>
				</Navigation>
			</Header>
		);
		const drawer = (
			<Drawer>
				<Navigation>
					{contextMenuItems}
				</Navigation>
			</Drawer>
		);
		const snackbar = (
			<Snackbar active={this.state.showError}
				action="Dismiss"
				onActionClick={::this.hideError}
				onTimeout={::this.hideError}>
				{this.props.authError ? this.props.authError.message : ''}
			</Snackbar>
		);

		return (
			<div className={css.app}>
				<Layout fixedHeader>
					{header}
					{drawer}
					{this.props.children}
				</Layout>
				{snackbar}
			</div>
		);
	}
	hideError() {
		this.setState({
			showError: false
		});
	}
}
