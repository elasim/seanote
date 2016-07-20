import cx from 'classnames';
import React, { Component, PropTypes } from 'react';
import FAButton from 'material-ui/FloatingActionButton';
import ContentAddIcon from 'material-ui/svg-icons/content/add';
import Droppable from '../../../../components/dnd/droppable';
import Symbol from '../../../../lib/symbol-debug';
import pure from 'recompose/pure';
import css from './fab.scss';

const EventTypes = {
	DragOver: Symbol('FAB.Event.DragOver'),
	DragOut: Symbol('FAB.Event.DragOut'),
	Drop: Symbol('FAB.Event.Drop'),
	Open: Symbol('FAB.Event.Open'),
	Close: Symbol('FAB.Event.Close'),
};

@pure
class FAB extends Component {
	static contextTypes = {
		hammer: PropTypes.object,
	};
	static propTypes = {
		onMessage: PropTypes.func,
	};
	componentWillMount() {
		this.state = {
			isActive: false,
			isDragOver: false,
		};
		this.dragEvents = {
			onDragOver: (::this.onOver),
			onDragOut: (::this.onOut),
			onDrop: (::this.onDrop),
		};
		this.close = ::this.close;
		this.open = ::this.open;
	}
	render() {
		const { className, icon } = this.props;
		const { isActive, isDragOver } = this.state;
		const Icon = icon ? icon : ContentAddIcon;
		const clickAction = isActive ? this.close : this.open;
		return (
			<Droppable {...this.dragEvents}>
				<div className={cx(className, css.root, {
					[css.active]: isActive
				})}>
					<FAButton ref="button" onClick={clickAction} secondary={isDragOver}>
						<Icon className={css.icon}/>
					</FAButton>
				</div>
			</Droppable>
		);
	}
	sendMessage(msg, args) {
		const { onMessage } = this.props;
		if (onMessage) {
			onMessage(msg, args);
		}
	}
	onOver(event, descriptor) {
		this.setState({ isDragOver: true });
		this.sendMessage(EventTypes.DragOver, {
			event,
			descriptor
		});
	}
	onOut(event, descriptor) {
		this.setState({ isDragOver: false });
		this.sendMessage(EventTypes.DragOut, {
			event,
			descriptor
		});
	}
	onDrop(event, descriptor) {
		this.setState({ isDragOver: false });
		this.sendMessage(EventTypes.Drop, {
			event,
			descriptor
		});
	}
	open() {
		this.setState({ isActive: true });
		this.sendMessage(EventTypes.Open, { dimClick: this.close });
	}
	close() {
		this.setState({ isActive: false });
		this.sendMessage(EventTypes.Close);
	}
}

FAB.EventTypes = EventTypes;

export default FAB;

