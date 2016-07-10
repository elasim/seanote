import Rx from 'rx';
import React, { Component, PropTypes, } from 'react';
import { findDOMNode } from 'react-dom';
import browserHistory from 'react-router/lib/browserHistory';
import Subheader from 'material-ui/Subheader';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import FontIcon from 'material-ui/FontIcon';
import { createScrollSpy, getViewportHeight } from '../../lib/dom-helpers';
import cx from 'classnames';
import css from './boards.scss';
import pure from 'recompose/pure';

const ListView = pure(class extends Component {
	componentWillMount() {
		this.state = {
			grab: null,
			grabPoint: null,
		};
	}
	render() {
		const { list } = this.props;
		const iconButtonElement = (
			<IconButton iconClassName="material-icons">
				more_vert
			</IconButton>
		);
		const iconMenu = (
			<IconMenu iconButtonElement={iconButtonElement}
				useLayerForClickAway={true}>
				<MenuItem style={{ WebkitAppearance: 'none' }}>See details</MenuItem>
				<MenuItem style={{ WebkitAppearance: 'none' }}>Setting</MenuItem>
				<MenuItem style={{ WebkitAppearance: 'none' }}>Share</MenuItem>
				<MenuItem style={{ WebkitAppearance: 'none' }}>Delete</MenuItem>
			</IconMenu>
		);
		const items = list
			.map(v => {
				const dragHandle = (
					<FontIcon draggable={true}
						style={{
							'msTouchAction': 'none'
						}}
						onDragStart={e => this::grabItem(e, v) }
						onTouchStart={e => this::grabItem(e, v, true) }
						onTouchMove={e => this::grabMove(e, v, true) }
						onTouchEnd={e => this::ungrab(e, true) }
						className="material-icons">
						drag_handle
					</FontIcon>
				);
				const props = {
					leftIcon: dragHandle,
					rightIconButton: iconMenu,
					primaryText: v.toString(),
					secondaryText: 'secondaryText',
					ref: `list-item-${v}`,
					onTouchTap() {
						this::open(v);
					},
				};
				return [
					<ListItem key={v} {...props} />,
					<Divider key={'div' + v} />
				];
			})
			.reduce((flat, current) => {
				flat.push(...current);
				return flat;
			}, []);
		let grab;
		if (this.state.grab !== null) {
			const grabItem = this.props.list[this.state.grab];
			// const {x, y} = this.state.grabPoint;
			grab = (
				<ListItem ref="grabview"
					leftIcon={<FontIcon className="material-icons">drag_handle</FontIcon>}
					primaryText={grabItem.toString() }
					secondaryText="secondaryText"
					/>
			);
		}
		return (
			<List>
				<Subheader>Board</Subheader>
				{items}
				{grab}
			</List>
		);
	}
});


class Boards extends Component {
	componentWillMount() {
		const list = new Array();
		for (let i = 0; i < 24; ++i) list.push(i);
		this.state = {
			list,
			showHeader: true,
		};
	}
	componentDidMount() {
		const _adjustLayout = this::adjustLayout;
		this.resizeSpy = createScrollSpy(_adjustLayout, getViewportHeight);
		_adjustLayout();
	}
	componoentWillUnmount() {
		this.resizeSpy.dispose();
	}
	render() {
		return (
			<div className={cx(css.root, {
				[css.viewer]: !!this.props.params.id,
				[css['hide-top']]: !this.state.showHeader,
			}) }>
				<div className={css.list}>
					<ListView list={this.state.list} />
				</div>
				<div className={css.content}>
					{this.props.children}
				</div>
			</div>
		);
	}
}

// Use Same adjusting logic to avoid rendering propagation
// Rerender process will break css animation
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

function open(val) {
	browserHistory.push(`/boards/${val}`);
}

function grabItem(e, v, isTouch = false) {
	e.preventDefault();
	e.stopPropagation();
	const element = findDOMNode(this.refs[`list-item-${v}`]);
	const bounding = element.getBoundingClientRect();
	let grabPoint = (isTouch) ? {
		x: e.touches[0].clientX - bounding.left,
		y: e.touches[0].clientY - bounding.top,
	} : {
		x: e.clientX - bounding.left,
		y: e.clientY - bounding.top,
	};
	this.setState({
		grab: this.props.list.findIndex(val => val == v),
		grabPoint,
	});

	if (!isTouch) {
		this._grabMoveListener = Rx.Observable.fromEvent(window, 'mousemove')
			.subscribe(e => this::grabMove(e, v));
		this._ungrabListener = Rx.Observable.fromEvent(window, 'mouseup')
			.subscribe(e => this::ungrab(e));
	}
}

function grabMove(e, v, isTouch = false) {
	e.preventDefault();
	e.stopPropagation();
	const point = isTouch ? e.touches[0] : { clientX: e.clientX, clientY: e.clientY };
	const grabPoint = this.state.grabPoint;
	const x = point.clientX - grabPoint.x;
	const y = point.clientY - grabPoint.y;
	// material-ui/ListItem component doesn't pass style property to root element
	const view = findDOMNode(this.refs.grabview);
	view.style.position = 'fixed';
	view.style.left = 0;
	view.style.top = 0;
	view.style.zIndex = 105;
	view.style.transform = `translate(${x}px, ${y}px)`;
}

function ungrab(e, isTouch = false) {
	e.preventDefault();
	e.stopPropagation();
	this.setState({
		grab: null,
		grabPoint: null,
	});
	if (!isTouch) {
		this._grabMoveListener.dispose();
		this._grabMoveListener = null;
		this._ungrabListener.dispose();
		this._ungrabListener = null;
	}
}

export default Boards;