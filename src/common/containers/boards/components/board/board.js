import cx from 'classnames';
import React, { Component, PropTypes } from 'react';
import { Grid, GridItem } from '../../../../components/grid';
import Droppable from '../../../../components/dnd/droppable';
import List from '../card';
import css from './board.scss';

export default class Board extends Component {
	static contextTypes = {
		setTitle: PropTypes.func.isRequired,
		hammer: PropTypes.object,
		list: PropTypes.object,
	};
	static propTypes = {
		id: PropTypes.string,
		lists: PropTypes.array,
		cards: PropTypes.object,
		actions: PropTypes.object,
		full: PropTypes.bool,
		onMessage: PropTypes.func,
	};
	componentWillMount() {
		this.context.setTitle('Board Item View');
		this.state = {
			activeOverlay: false,
			frontOverlay: false,
		};
		this.toggleOverlay = ::this.toggleOverlay;
		this.dispatchMessage = ::this.dispatchMessage;
		this.onDrop = ::this.onDrop;
	}
	componentWillReceiveProps(nextProps) {
		if (this.props.id !== nextProps.id) {
			this.loadListData(nextProps.id);
			if (typeof window !== 'undefined') {
				window.scrollTo(0, 1);
			}
		}
	}
	componentDidMount() {
		window.scrollTo(0, 1);
		this.disposeDragHook = this.context.hammer.createHook(
			::this.prepareOverlay,
			null,
			::this.moveBackOverlay
		);
		this.loadListData(this.props.id);
	}
	componentWillUnmount() {
		this.disposeDragHook();
	}
	render() {
		const { className } = this.props;
		const { activeOverlay, frontOverlay } = this.state;
		const items = this.renderItems();
		const rootClassName = cx(className, css.root, {
			[css.full]: this.props.full
		});
		const overlayClassName = cx(css.overlay, {
			[css.front]: frontOverlay,
			[css.active]: activeOverlay
		});
		return (
			<Droppable
				onDragOver={this.toggleOverlay}
				onDragOut={this.toggleOverlay}
				onDrop={this.onDrop} >
				<div className={rootClassName}>
					<Grid columnClassName={css.topic}>
						{items}
					</Grid>
					<div className={overlayClassName} />
				</div>
			</Droppable>
		);
	}
	renderItems() {
		const { lists, cards } = this.props;
		return lists ? lists.map(list => (
			<GridItem key={list.id} id={list.id} className={css.topic}>
				<List list={list} cards={cards[list.id]} onMessage={this.dispatchMessage}/>
			</GridItem>
		)) : null;
	}
	dispatchMessage(msg, arg) {
		switch (msg) {
			case List.EventTypes.DragOver: {
				const { descriptor, target } = arg;
				const { type } = descriptor;
				const source = descriptor.data.BoardId;
				const sourceId = descriptor.data.id;
				if (sourceId === target.id || type !== 'list') return;
				this.context.list.sort(source, sourceId, target.BoardId, target.id);
				break;
			}
			default:
				return this.sendMessage(msg, arg);
		}
	}
	sendMessage(msg, arg) {
		const { onMessage } = this.props;
		if (onMessage) {
			onMessage(msg, arg);
		}
	}
	loadListData(id) {
		if (typeof id === 'undefined') return;
		return this.context.list.load(id);
	}
	prepareOverlay(e) {
		if (e.descriptor.type !== 'board') {
			return;
		}
		this.setState({ frontOverlay: true });
	}
	moveBackOverlay() {
		if (this.state.frontOverlay) {
			this.setState({ frontOverlay: false });
		}
	}
	toggleOverlay(e, descriptor) {
		if (descriptor.data.id === this.props.id || !this.state.frontOverlay) {
			return;
		}
		this.setState({ activeOverlay: !this.state.activeOverlay });
	}
	onDrop(event, descriptor) {
		if (descriptor.type !== 'board') {
			return;
		}
		this.toggleOverlay(event, descriptor);
	}
}
