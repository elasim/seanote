import cx from 'classnames';
import React, { Component, PropTypes } from 'react';
import isEqual from 'lodash/isEqual';
import Draggable from '../../../../components/dnd/draggable';
import Droppable from '../../../../components/dnd/droppable';
import Symbol from '../../../../lib/symbol-debug';
import CardContent from './card-content';
import css from './card-item.scss';

const EventTypes = {
	DragOver: Symbol('CardItem.DragOver'),
	DragOut: Symbol('CardItem.DragOut'),
	Drop: Symbol('CardItem.Drop'),
};

export default class CardItem extends Component {
	static EventTypes = EventTypes;
	static propTypes = {
		style: PropTypes.object,
		className: PropTypes.string,
		data: PropTypes.object,
		onMessage: PropTypes.func,
	};
	componentWillMount() {
		this.onDragStart = ::this.onDragStart;
		this.onDragOver = ::this.onDragOver;
		this.onDragOut = ::this.onDragOut;
		this.onDragEnd = ::this.onDragEnd;
		this.onDrop = ::this.onDrop;
		this.state = {
			isDragging: false
		};
	}
	shouldComponentUpdate(nextProps, nextState) {
		return !isEqual(this.props.data, nextProps.data)
			|| !isEqual(this.state, nextState);
	}
	render() {
		const { style, className, data } = this.props;
		const liClassName = cx(className, {
			[css.float]: this.state.isDragging,
		});
		return (
			<Droppable key={data.id} delay={250}
				onDragOver={this.onDragOver} onDragOut={this.onDragOut}
				onDrop={this.onDrop}>
				<Draggable data={data} type="card" press={true}
					preview={<CardItemPreview />}
					onDragStart={this.onDragStart} onDragEnd={this.onDragEnd}>
					<li className={liClassName} style={style}>
						<CardContent data={data.value} />
					</li>
				</Draggable>
			</Droppable>
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
	onDragOut(event, descriptor) {
		this.sendMessage(EventTypes.DragOut, {
			event,
			descriptor,
			target: this.props.data
		});
	}
	onDragStart() {
		this.setState({
			isDragging: true
		});
	}
	onDragEnd(event, descriptor) {
		if (!descriptor || !this.props.data) {
			return;
		}
		if (this.props.data.ListId === descriptor.data.ListId) {
			this.setState({
				isDragging: false
			});
		}
	}
	onDrop(event, descriptor) {
		this.sendMessage(EventTypes.Drop, {
			event,
			descriptor,
			target: this.props.data
		});
	}
}

function CardItemPreview(props) {
	const rect = props.descriptor.element.getBoundingClientRect();
	const style = Object.assign({
		width: rect.width,
		height: rect.height,
	});
	return <div style={props.style} className={props.className}>
		<div className={css.preview} style={style} />
	</div>;
}
