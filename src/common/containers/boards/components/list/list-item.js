import cx from 'classnames';
import React, { Component, PropTypes } from 'react';
import Link from 'react-router/lib/Link';
import FontIcon from 'material-ui/FontIcon';
import isEqual from 'lodash/isEqual';
import Droppable from '../../../../components/dnd/droppable';
import Draggable from '../../../../components/dnd/draggable';
import Symbol from '../../../../lib/symbol-debug';
import css from './list-item.scss';

const EventTypes = {
	DragOver: Symbol('BoardListItem.DragOver'),
};

class BoardListItem extends Component {
	static EventTypes = EventTypes;
	static propTypes = {
		data: PropTypes.object,
		active: PropTypes.bool,
		onMessage: PropTypes.func,
	};
	static contextTypes = {
		intl: PropTypes.object,
	};
	shouldComponentUpdate(nextProps) {
		// eslint-disable-next-line no-unused-vars
		const { data, children, ...otherProps} = this.props;
		for (const key in otherProps) {
			if (nextProps[key] !== otherProps[key]) {
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
			<ItemContent {...text} leftIcon={handle}
				className={css.preview} />
		);
		const dragHandle = (
			<Droppable onDragOver={this.onDragOver}>
				<Draggable data={props.data} preview={preview} type="board">
					{handle}
				</Draggable>
			</Droppable>
		);
		const className = cx({
			[css.active]: props.active
		});
		return (
			<ItemContent
				className={className}
				{...text}
				link={`/boards/${props.data.id}`}
				leftIcon={dragHandle}
				rightIconButton={props.children}
			/>
		);
	}
	sendMessage(msg, args) {
		const { onMessage } = this.props;
		if (onMessage) {
			onMessage(msg, args);
		}
	}
	onDragOver(event, descriptor) {
		this.sendMessage(EventTypes.DragOver, {
			event,
			descriptor,
			target: this.props.data
		});
	}
}

function ItemContent(props) {
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

export default BoardListItem;
