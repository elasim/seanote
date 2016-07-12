import cx from 'classnames';
import React, { Component, PropTypes } from 'react';
import Link from 'react-router/lib/Link';
import FlatButton from 'material-ui/FlatButton';
import pure from 'recompose/pure';
import css from '../styles/nav.scss';
import {
	createResizeSpy,
	getViewportWidth,
} from '../../../lib/dom-helpers';

class Nav extends Component {
	static propTypes = {
		items: PropTypes.array,
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
		const _adjustLayout = this::adjustLayout;
		this.resizeSpy = createResizeSpy(_adjustLayout, getViewportWidth);

		_adjustLayout();
	}
	componentWillUnmount() {
		if (this.resizeSpy) {
			this.resizeSpy.dispose();
		}
	}
	render() {
		const { className, style, items } = this.props;
		const { narrow } = this.state;
		const menus = items.map((item, i) => {
			const props = {
				key:  i,
				narrow,
				...item,
				style: {
					width: narrow ?
						`${Math.floor(1 / items.length * 100)}%` : '100%'
				}
			};
			return <NavMenu {...props} />;
		});
		return (
			<div className={cx(css.root, className)} style={style}>
				{menus}
			</div>
		);
	}
}

function adjustLayout() {
	const narrow = document.body.clientWidth <= 600;
	if (this.state.narrow !== narrow) {
		this.setState({ narrow });
	}
}

class NavMenu extends Component {
	static propTypes = {
		className: PropTypes.string,
		style: PropTypes.object,
		narrow: PropTypes.bool,
		icon: PropTypes.element,
		label: PropTypes.string,
		link: PropTypes.string,
		items: PropTypes.array,
	};
	render() {
		const { label, icon, narrow, className, style, link } = this.props;
		return (
			<div className={cx(css.menu, className)} style={style}>
				<Link to={link}>
					<FlatButton
						icon={icon}
						label={!narrow ? label : null}
						labelStyle={{color: '#fff'}}
						style={{
							width: '100%',
							height: 50,
							textAlign: !narrow ? 'left' : 'center',
						}} />
				</Link>
				{/* items here */}
			</div>
		);
	}
}

export default pure(Nav);
