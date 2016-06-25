import cx from 'classnames';
import React, { Component, PropTypes } from 'react';
import emptyFunction from 'fbjs/lib/emptyFunction';
import { DragSource } from 'react-dnd';
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FABButton,
	Icon,
	Tooltip,
} from 'react-mdl';
import css from './add.scss';

@DragSource('Command', {
	beginDrag(props) {
		return {
			type: props.type,
		};
	}
}, (connect, monitor) => ({
	connectDragSource: connect.dragSource(),
	connectDragPreview: connect.dragPreview(),
	isDragging: monitor.isDragging(),
}))
export default class ItemButton extends Component {
	static propTypes = {
		icon: PropTypes.string.isRequired,
		label: PropTypes.string.isRequired,
		onClick: PropTypes.func,
	};
	static defaultProps = {
		onClick: emptyFunction,
	};
	render() {
		const {
			connectDragSource,
			connectDragPreview,
			isDragging,
			className,
			style,
			icon,
			label,
			onClick,
		} = this.props;
		return connectDragPreview(connectDragSource(
			<div>
				<Tooltip label={label} position="left">
					<FABButton className={className} style={style}
						accent={isDragging}
						onClick={onClick} onTouchTap={onClick}>
						<Icon name={icon} />
					</FABButton>
				</Tooltip>
			</div>
		));
	}
}
