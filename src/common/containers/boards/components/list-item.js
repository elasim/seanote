import cx from 'classnames';
import React, { Component, PropTypes } from 'react';
import Link from 'react-router/lib/Link';
import FontIcon from 'material-ui/FontIcon';
import isEqual from 'lodash/isEqual';

import Droppable from '../../../lib/dnd/droppable';
import Draggable from '../../../lib/dnd/draggable';
import css from '../styles/list-item.scss';

function ListItem(props) {
	let content = (
		<div>
			<div className={css.primary}>{props.primaryText}</div>
			<p className={css.secondary}>{props.secondaryText}</p>
		</div>
	);
	if (props.link) {
		content = (
			<Link to={props.link}>
				{content}
			</Link>
		);
	}
	return (
		<div style={props.style} className={cx(css.root, props.className)}>
			{props.leftIcon}
			<div className={css['right-icon']}>{props.rightIconButton}</div>
			{content}
		</div>
	);
}

class BoardListItem extends Component {
	static propTypes = {
		data: PropTypes.object,
		onDragOver: PropTypes.func,
		onMenu: PropTypes.func,
		active: PropTypes.bool,
	};
	static contextTypes = {
		intl: PropTypes.object,
	};
	shouldComponentUpdate(nextProps) {
		// eslint-disable-next-line no-unused-vars
		const { data, children, ...otherProps} = this.props;

		for (const key in otherProps) {
			if (nextProps[key] !== otherProps[key]) {
				console.log(key);
				return true;
			}
		}
		if (!isEqual(data, nextProps.data)) { 
			return true;
		}

		return false;
	}
	componentWillMount() {
		this.onDragOver = ::this.onDragOver;
		this.onMenu = ::this.onMenu;
	}
	render() {
		const { props, context } = this;
		const handle = (
			<div className={css['left-icon']}>
				<FontIcon className="material-icons">&#xE25D;</FontIcon>
			</div>
		);
		const text = {
			primaryText: `${props.data.name}`,
			secondaryText: context.intl.formatRelative(props.data.updatedAt),
		};
		const preview = (
			<ListItem {...text} leftIcon={handle}
				className={css.preview} />
		);
		const dragHandle = (
			<Droppable onDragOver={this.onDragOver}>
				<Draggable data={props.data} preview={preview}>
					{handle}
				</Draggable>
			</Droppable>
		);
		const className = cx({
			[css.active]: props.active
		});
		return (
			<ListItem
				className={className}
				{...text}
				link={`/boards/${props.data.id}`}
				leftIcon={dragHandle}
				rightIconButton={props.children}
			/>
		);
	}
	onDragOver(...args) {
		this.props.onDragOver(...args, this.props.data);
	}
	onMenu(...args) {
		this.props.onMenu(...args, this.props.data);
	}
}

export default BoardListItem;
