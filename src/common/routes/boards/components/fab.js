import cx from 'classnames';
import React, { Component, PropTypes } from 'react';
import FAButton from 'material-ui/FloatingActionButton';
import ContentAddIcon from 'material-ui/svg-icons/content/add';
import Droppable from '../../../lib/dnd/droppable';
import css from '../styles/fab.scss';

const EventTypes = {
	DRAG_OVER: Symbol('FAB.Event.DragOver'),
	DRAG_OUT: Symbol('FAB.Event.DragOut'),
	DROP: Symbol('FAB.Event.Drop'),
	OPEN: Symbol('FAB.Event.Open'),
	CLOSE: Symbol('FAB.Event.Close'),
};

class FAB extends Component {
	static EventTypes = EventTypes;
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
	onOver(...args) {
		this.setState({ isDragOver: true });
		const { onMessage } = this.props;
		if (onMessage) {
			onMessage(EventTypes.DRAG_OVER, args);
		}
	}
	onOut(...args) {
		this.setState({ isDragOver: false });
		const { onMessage } = this.props;
		if (onMessage) {
			onMessage(EventTypes.DRAG_OUT, args);
		}
	}
	onDrop(...args) {
		this.setState({ isDragOver: false });
		const { onMessage } = this.props;
		if (onMessage) {
			onMessage(EventTypes.DROP, args);
		}
	}
	open() {
		this.setState({ isActive: true });
		const { onMessage } = this.props;
		if (onMessage) {
			onMessage(EventTypes.OPEN, { dimClick: this.close });
		}
	}
	close() {
		this.setState({ isActive: false });
		const { onMessage } = this.props;
		if (onMessage) {
			onMessage(EventTypes.CLOSE);
		}
	}
}

export default FAB;

