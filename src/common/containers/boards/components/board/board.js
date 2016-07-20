import cx from 'classnames';
import React, { Component, PropTypes } from 'react';
import { Grid, GridItem } from '../../../../components/grid';
import Droppable from '../../../../components/dnd/droppable';
import Card from '../card';
import css from './board.scss';

export default class Board extends Component {
	static contextTypes = {
		setTitle: PropTypes.func.isRequired,
		hammer: PropTypes.object,
	}
	static propTypes = {
		id: PropTypes.string,
		data: PropTypes.object,
		actions: PropTypes.object,
		full: PropTypes.bool,
	}
	componentWillMount() {
		this.context.setTitle('Board Item View');
		this.state = {
			activeOverlay: false,
			frontOverlay: false,
		};
		this.toggleOverlay = ::this.toggleOverlay;
		this.dispatchMessage = ::this.dispatchMessage;
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
				onDrop={this.toggleOverlay} >
				<div>
					<Grid className={rootClassName} columnClassName={css.topic}>
						{items}
					</Grid>
					<div className={overlayClassName} />
				</div>
			</Droppable>
		);
	}
	renderItems() {
		const { data } = this.props;
		return data ? data.lists.map(item => (
			<GridItem key={item.id} id={item.id} className={css.topic}>
				<Card data={item} onMessage={this.dispatchMessage}/>
			</GridItem>
		)) : null;
	}
	dispatchMessage(type, arg) {
		switch (type) {
			case Card.EventTypes.DragOver: {
				const { descriptor, target } = arg;
				if (descriptor.data.id === target.id || descriptor.type !== 'list') return;
				this.props.actions.sort(this.props.id, descriptor.data.id, target.id);
				break;
			}
			case Card.EventTypes.Drop: {
				//return EventTypes.SubItemDrop;
				break;
			}
			case Card.EventTypes.SubitemDragover: {
				const { descriptor, target } = arg;
				if (descriptor.data.id === target.id || descriptor.type !== 'card') return;
				console.log('Sort Card');
				//this.props.actions.sort(this.props.id, descriptor.data.id, target.id);
				break;
			}
			default: {
				console.log('Unhandled Event', type);
				break;
			}
		}
	}
	loadListData(id) {
		if (typeof id === 'undefined') return;
		return this.props.actions.load(id);
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
}
