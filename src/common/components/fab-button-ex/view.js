import cx from 'classnames';
import React, { Component, PropTypes } from 'react';
import { DropTarget } from 'react-dnd';
import { FABButton, Icon } from 'react-mdl';
import './style.css';

const emptyFunc = () => {};

export default function HOC(type) {
	@DropTarget(type, {
		drop(props, monitor, component) {
			component.props.onDrop.apply(component, arguments);
		}
	}, (connect, monitor) => ({
		connectDropTarget: connect.dropTarget(),
		canDrop: monitor.canDrop(),
		isOver: monitor.isOver({ shallow: true }),
	}))
	class FABButtonEx extends Component {
		static propTypes = {
			decoration: PropTypes.object,
			onClick: PropTypes.func,
			onDrop: PropTypes.func,
			icon: PropTypes.string.isRequired,
		};
		static defaultProps ={
			decoration: {},
			onClick: emptyFunc,
			onDrop: emptyFunc,
		};
		render() {
			const {
				connectDropTarget,
				isOver,
				canDrop,
				decoration,
				onClick,
				icon
			} = this.props;
			const classes = cx(
				'control',
				'drop-fab-btn',
				{ 'drop-over': isOver && canDrop }
			);
			return connectDropTarget(
				<div className={classes}>
					<FABButton {...decoration} onClick={onClick}>
						<Icon name={icon} />
					</FABButton>
				</div>
			);
		}
	}
	return FABButtonEx;
}
