import React, { Component, PropTypes } from 'react';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import isEqual from 'lodash/isEqual';
import Droppable from '../../../../components/dnd/droppable';
import Draggable from '../../../../components/dnd/draggable';
import Symbol from '../../../../lib/symbol-debug';
import CardItem from './card-item';
import css from './card.scss';

const EventTypes = {
	DragOver: Symbol('Card.DragOver'),
	Drop: Symbol('Card.Drop'),
	SubitemDragover: CardItem.EventTypes.DragOver,
	SubitemDrop: CardItem.EventTypes.Drop,
};

export default class CardComponent extends Component {
	static EventTypes = EventTypes;
	static propTypes = {
		data: PropTypes.object,
		onMessage: PropTypes.func,
	};
	componentWillMount() {
		this.dispatchMessage = ::this.dispatchMessage;
		this.onDragOver = ::this.onDragOver;
		this.onDrop = ::this.onDrop;
	}
	shouldComponentUpdate(nextProps) {
		return !isEqual(nextProps, this.props);
	}
	render() {
		const { data } = this.props;
		const items = this.renderItems();
		return (
			<Droppable onDragOver={this.onDragOver} onDrop={this.onDrop} delay={250}>
				<Draggable data={data} type="list" preview={<CardPreview />} press>
					<Card className={this.props.className} style={this.props.style}>
						<CardHeader title={data.name}/>
						<CardText>
							<ol className={css.list}>
								{items}
							</ol>
						</CardText>
					</Card>
				</Draggable>
			</Droppable>
		);
	}
	renderItems() {
		return this.props.data.Cards.map(card => {
			return <CardItem data={card} key={card.id} onMessage={this.dispatchMessage}/>;
		});
	}
	dispatchMessage(msg, args) {
		this.sendMessage(msg, args);
	}
	sendMessage(msg, args) {
		const { onMessage } = this.props;
		if (onMessage) {
			onMessage(msg, args);
		}
	}
	onDragOver(event, descriptor) {
		const { data } = this.props;
		if (descriptor.type === 'list' || descriptor.type === 'card') {
			this.sendMessage(EventTypes.DragOver, {
				event,
				descriptor,
				target: data
			});
			return;
		}
	}
	onDrop(event, descriptor) {
		const { data } = this.props;
		if (descriptor.typ === 'list' || descriptor.type === 'card') {
			this.sendMessage(EventTypes.Drop, {
				event,
				descriptor,
				target: data
			});
		}
	}
}

function CardPreview(props) {
	const rect = props.descriptor.element.getBoundingClientRect();
	const style = Object.assign({
		width: rect.width,
		height: rect.height,
	});
	return (
		<div className={props.className} style={props.style}>
			<div className={css.preview} style={style} />
		</div>
	);
}
