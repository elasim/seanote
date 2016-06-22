import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import {
// Header,
	Navigation,
	Drawer,
	Layout,
	Button,
	Textfield,
	Icon
} from 'react-mdl';
// import ContentWrapper from '../../components/content';
import Header from './header';
import css from './style.scss';
import './global.css';

if (process.env.BROWSER) {
	require('../../thirds/material.custom.css');
	require('../../thirds/material.custom.js');
}

@connect((state) => ({
	contextMenu: state.app.contextMenu,
	title: state.app.title,
}))
class App extends React.Component {
	constructor(props, context) {
		super(props, context);
	}
	componentWillReceiveProps(nextProps) {
		if (this.props.title != nextProps.title) {
			document.title = nextProps.title;
		}
	}
	render() {
		const { contextMenu } = this.props;
		const titleLink = (
			<Link to="/" className={css.title}>
				<Button primary ripple>{this.props.title}</Button>
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
		return (
			<div className={css.app}>
				<Layout fixedHeader>
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
					<Drawer>
						<Navigation>
							{contextMenuItems}
						</Navigation>
					</Drawer>
					{this.props.children}
				</Layout>
			</div>
		);
	}
	componentDidMount() {
		console.log('AppComponent Did Mount');
	}
	componentWillUnmount() {
		console.log('AppComponent will Unmount');
	}
}

export default App;
