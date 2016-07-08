import cx from 'classnames';
import React, { Component, PropTypes } from 'react';
import FlatButton from 'material-ui/FlatButton';
import {
	createResizeSpy,
	getViewportWidth,
} from '../helpers';
import css from './nav.scss';

export default class Nav extends Component {
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
		items: PropTypes.array,
	};
	render() {
		const { label, icon, narrow, className, style } = this.props;
		return (
			<div className={cx(css.menu, className)} style={style}>
				<FlatButton
					icon={icon}
					label={!narrow ? label : null}
					labelStyle={{color: '#fff'}}
					style={{
						width: '100%',
						height: 50,
						textAlign: !narrow ? 'left' : 'center',
					}} />
				{/* items here */}
			</div>
		);
	}
}
