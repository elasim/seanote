import cx from 'classnames';
import React, { PropTypes } from 'react';
import isEqual from 'lodash/isEqual';
import { Card, CardText } from 'material-ui/Card';
import ComponentEx from '../../../component';
import Draggable from '../../../../components/dnd/draggable';
import Droppable from '../../../../components/dnd/droppable';
import Symbol from '../../../../lib/symbol-debug';
import CardContent from './card-content';
import css from './card-item.scss';

const debug = require('debug')('Component::CardItem');

const EventTypes = {
	DataChange: Symbol('CardItem.DataChange'),
	DragOver: Symbol('CardItem.DragOver'),
	DragOut: Symbol('CardItem.DragOut'),
	Drop: Symbol('CardItem.Drop'),
};

export default class CardItem extends ComponentEx {
	static EventTypes = EventTypes;
	static propTypes = {
		style: PropTypes.object,
		className: PropTypes.string,
		data: PropTypes.object,
	};
	componentWillMount() {
		this.dispatchMessage = ::this.dispatchMessage;
		this.onDragStart = ::this.onDragStart;
		this.onDragOver = ::this.onDragOver;
		this.onDragOut = ::this.onDragOut;
		this.onDragEnd = ::this.onDragEnd;
		this.onDrop = ::this.onDrop;
		this.state = {
			isDragging: false,
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
					<li ref="field" className={liClassName} style={style}>
						<Card>
							<CardText>
								<CardContent data={data.value} onMessage={this.dispatchMessage} />
							</CardText>
						</Card>
					</li>
				</Draggable>
			</Droppable>
		);
	}
	dispatchMessage(msg, args) {
		const { data } = this.props;
		switch (msg) {
			case 'change':
				this.sendMessage(EventTypes.DataChange, {
					ListId: data.ListId,
					id: data.id,
					nextValue: args,
				});
				break;
			default:
				debug('Unhandled Event');
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
