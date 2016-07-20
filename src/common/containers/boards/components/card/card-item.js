import React, { Component, PropTypes } from 'react';
import isEqual from 'lodash/isEqual';
import Draggable from '../../../../components/dnd/draggable';
import Droppable from '../../../../components/dnd/droppable';
import Symbol from '../../../../lib/symbol-debug';
import css from './card.scss';

const EventTypes = {
	DragOver: Symbol('CardItem.DragOver'),
	Drop: Symbol('CardItem.Drop'),
};

export default class CardItem extends Component {
	static EventTypes = EventTypes;
	static propTypes = {
		data: PropTypes.object,
		onMessage: PropTypes.func,
	};
	componentWillMount() {
		this.onDragOver = ::this.onDragOver;
		this.onDrop = ::this.onDrop;
	}
	shouldComponentUpdate(nextProps) {
		return !isEqual(this.props.data, nextProps.data);
	}
	render() {
		const { data } = this.props;
		console.log(data);
		return (
			<Droppable key={data.id} onDragOver={this.onDragOver} onDrop={this.onDrop}>
				<Draggable preview={<CardItemPreview />} data={data} type="card" press>
					<li>{data.value.type}</li>
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
		<div className={css.preview} style={style}>
			Card
		</div>
	</div>;
}
