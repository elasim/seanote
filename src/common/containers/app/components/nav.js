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

@pure
class Nav extends Component {
	static propTypes = {
		headers: PropTypes.array,
		items: PropTypes.object,
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
		const { className, style, headers, items } = this.props;
		const { narrow } = this.state;
		const menus = headers.map((header, headIndex) => {
			const props = {
				key:  headIndex,
				narrow,
				...header,
				style: {
					width: narrow ?
						`${Math.floor(1 / headers.length * 100)}%` : '100%'
				},
				items: items[headIndex] || [],
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

NavMenu.propTypes = {
	className: PropTypes.string,
	style: PropTypes.object,
	narrow: PropTypes.bool,
	icon: PropTypes.element,
	label: PropTypes.string,
	link: PropTypes.string,
	items: PropTypes.array,
};

function NavMenu(props) {
	const {
		label,
		icon,
		narrow,
		className,
		style,
		link,
		items,
	} = props;
	const commonProps = {
		labelStyle: {color: '#fff'},
	};
	const childs = items.map((item, index) => {
		return (
			<Link to={`${link}/${item.id}`} key={index}>
				<FlatButton {...commonProps}
					style={{
						textAlign: 'left',
						width: '100%',
					}}
					label={item.name}
				/>
			</Link>
		);
	});
	return (
		<div className={cx(css.menu, className)} style={style}>
			<Link to={link}>
				<FlatButton
					{...commonProps}
					icon={icon}
					label={!narrow ? label : null}
					style={{
						width: '100%',
						height: 50,
						textAlign: !narrow ? 'left' : 'center',
					}} />
			</Link>
			<div style={{
				display: narrow ? 'none' : 'block'
			}}>
				{childs}
			</div>
		</div>
	);
}

export default Nav;
