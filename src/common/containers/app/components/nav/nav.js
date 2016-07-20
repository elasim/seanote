import cx from 'classnames';
import React, { Component, PropTypes } from 'react';
import FontIcon from 'material-ui/FontIcon';
import pure from 'recompose/pure';
import NavItem from './nav-item';
import css from './nav.scss';

import { createResizeSpy, getViewportWidth } from '../../../../lib/dom-helpers';

const NAV_HEADERS = [
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

@pure
class Nav extends Component {
	static propTypes = {
		headers: PropTypes.array,
		className: PropTypes.string,
		style: PropTypes.object,
	}
	constructor(...args) {
		super(...args);
	}
	componentWillMount() {
		this.state = {
			narrow: false
		};
	}
	componentDidMount() {
		this.adjustLayout = ::this.adjustLayout;
		this.resizeSpy = createResizeSpy(this.adjustLayout, getViewportWidth);

		this.adjustLayout();
	}
	componentWillUnmount() {
		if (this.resizeSpy) {
			this.resizeSpy.dispose();
		}
	}
	render() {
		const { className, style } = this.props;
		const { narrow } = this.state;
		const items = NAV_HEADERS.map((header, headIndex) => {
			const props = {
				key:  headIndex,
				narrow,
				...header,
				style: {
					width: narrow ?
						`${Math.floor(1 / NAV_HEADERS.length * 100)}%` : '100%'
				},
			};
			return <NavItem {...props} />;
		});
		return (
			<div className={cx(css.root, className)} style={style}>
				{items}
			</div>
		);
	}
	adjustLayout() {
		const narrow = document.body.clientWidth <= 600;
		if (this.state.narrow !== narrow) {
			this.setState({ narrow });
		}
	}
}

export default Nav;
