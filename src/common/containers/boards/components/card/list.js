import cx from 'classnames';
import React, { Component, PropTypes } from 'react';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import isEqual from 'lodash/isEqual';
import Droppable from '../../../../components/dnd/droppable';
import Draggable from '../../../../components/dnd/draggable';
import Symbol from '../../../../lib/symbol-debug';
import Input from './input';
import Button from './button';
import CardItem from './card-item';
import css from './card.scss';

const debug = require('debug')('Component::Card');

const EventTypes = {
	DragOver: Symbol('Card.DragOver'),
	Drop: Symbol('Card.Drop'),
};

export default class CardList extends Component {
	static EventTypes = EventTypes;
	static contextTypes = {
		card: PropTypes.object,
	};
	static propTypes = {
		list: PropTypes.object,
		cards: PropTypes.array,
		onMessage: PropTypes.func,
	};
	componentWillMount() {
		this.dispatchMessage = ::this.dispatchMessage;
		this.onDragOver = ::this.onDragOver;
		this.onDragOut = ::this.onDragOut;
		this.onDragStart = ::this.onDragStart;
		this.onDragEnd = ::this.onDragEnd;
		this.onDrop = ::this.onDrop;
		this.state = {
			overlay: false,
			editable: false,
		};
	}
	shouldComponentUpdate(nextProps, nextState) {
		return !isEqual(nextProps, this.props) || !isEqual(nextState, this.state);
	}
	render() {
		const { list, className, style } = this.props;
		const { editable } = this.state;
		const items = this.renderItems();
		const overlayClassName = cx(css.overlay, {
			[css.active]: this.state.overlay,
		});
		return (
			<Droppable delay={250}
				onDragOver={this.onDragOver}
				onDragOut={this.onDragOut}
				onDrop={this.onDrop} >
				<Draggable data={list} type="list" preview={<CardPreview />} press
					onDragStart={this.onDragStart} onDragEnd={this.onDragEnd} >
					<div>
						<Card className={className} style={style}>
							<CardHeader textStyle={{ width: '100%' }}
								style={{ padding: '16px 16px 0px 16px' }}
								title={<div>
									<Button style={{ float: 'right', margin: 0, padding: 0 }}/>
									<div contentEditable={editable} dangerouslySetInnerHTML={{__html:list.name}} />
								</div>}
							/>
							<CardText>
								<ol className={css.list}>
									{items}
								</ol>
								<Input id={list.id} onMessage={this.dispatchMessage} />
							</CardText>
						</Card>
						<div className={overlayClassName}>
							<i className="material-icons">&#xE154;</i>
							<div className={css.background} />
						</div>
					</div>
				</Draggable>
			</Droppable>
		);
	}
	renderItems() {
		return this.props.cards.map(card => {
			return (
				<CardItem key={card.id} data={card}
					onMessage={this.dispatchMessage}
				/>
			);
		});
	}
	dispatchMessage(msg, args) {
		switch (msg) {
			case Input.EventTypes.Submit: {
				debug(msg, args);
				return;
			}
			case CardItem.EventTypes.DataChange: {
				this.context.card.update(args.ListId, args.id, args.nextValue);
				return;
			}
			case CardItem.EventTypes.DragOver: {
				const { descriptor, target } = args;
				const listId = descriptor.data.ListId;
				const cardId = descriptor.data.id;

				if (descriptor.type !== 'card') break;
				if (cardId === target.id) break;
				if (listId === target.ListId) {
					this.context.card.sort(listId, cardId, target.id);
				} else {
					this.setState({ overlay: true });
				}
				return;
			}
			case CardItem.EventTypes.DragOut: {
				if (this.state.overlay) {
					this.setState({ overlay: false });
				}
				return;
			}
			case CardItem.EventTypes.Drop: {
				const { descriptor, target } = args;
				const listId = descriptor.data.ListId;
				const cardId = descriptor.data.id;

				if (descriptor.type !== 'card') break;
				if (listId === target.ListId) break;
				this.context.card.move(listId, cardId, target.ListId);
				this.setState({
					overlay: false
				});
				return;
			}
		}
		return this.sendMessage(msg, args);
	}
	sendMessage(msg, args) {
		const { onMessage } = this.props;
		if (onMessage) {
			onMessage(msg, args);
		}
	}
	onDragStart(event) {

	}
	onDragEnd(event) {

	}
	onDragOver(event, descriptor) {
		const { list } = this.props;
		if (descriptor.type === 'list') {
			this.sendMessage(EventTypes.DragOver, {
				event,
				descriptor,
				target: list,
			});
			return;
		} else if (descriptor.type === 'card' && descriptor.data.ListId !== list.id) {
			this.setState({
				overlay: true
			});
		}
	}
	onDragOut(event, descriptor) {
		if (descriptor.type === 'card' && this.state.overlay) {
			this.setState({
				overlay: false
			});
		}
	}
	onDrop(event, descriptor) {
		const { list } = this.props;
		if (descriptor.type === 'list') {
			this.sendMessage(EventTypes.Drop, {
				event,
				descriptor,
				target: list
			});
		} else if (descriptor.type === 'card') {
			const listId = descriptor.data.ListId;
			const cardId = descriptor.data.id;
			this.context.card.move(listId, cardId, list.id);
			this.setState({
				overlay: false
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
