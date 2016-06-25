import React, { Component, PropTypes } from 'react';
import emptyFunction from 'fbjs/lib/emptyFunction';
import { DropTarget } from 'react-dnd';
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FABButton,
	Icon,
} from 'react-mdl';

@DropTarget([
	'BoardListItem',
	'SortableListItem',
], {
	drop(props, monitor, component) {
		component.moveToTrash(
			monitor.getItemType(),
			monitor.getItem()
		);
		// component.props.onDrop.apply(component, arguments);
	}
}, (connect, monitor) => ({
	connectDropTarget: connect.dropTarget(),
	canDrop: monitor.canDrop(),
	isOver: monitor.isOver({ shallow: true }),
}))
export default class TrashButton extends Component {
	static propTypes = {
		getTrashCounts: PropTypes.func.isRequired,
		onEmptyTrash: PropTypes.func,
		onDropCard: PropTypes.func,
		onDropBoard: PropTypes.func,
	};
	static defaultProps = {
		onEmptyTrash: emptyFunction,
		onDropCard: emptyFunction,
		onDropBoard: emptyFunction,
	};
	constructor(props, context) {
		super(props, context);
		this.state = {
			dialog: false
		};
	}
	render() {
		const {
			connectDropTarget,
			isOver,
			canDrop,
			className,
			style
		} = this.props;
		const icon = canDrop ? 'clear' : 'delete';
		return connectDropTarget(
			<div style={{display: 'inline-block', marginLeft: 5}}>
				<FABButton onClick={::this.toggleDialog}
					disabled={this.isDisabled()}
					accent={isOver && canDrop}
					className={className}
					style={style}
				>
					<Icon name={icon} />
				</FABButton>
				<Dialog open={this.state.dialog}>
					<DialogTitle>Delete?</DialogTitle>
					<DialogContent>
						Are you sure you want to permanently delete items in trash?
					</DialogContent>
					<DialogActions>
						<Button accent type="button"
							onClick={::this.emptyTrash} >
							Delete
						</Button>
						<Button colored type="button"
							onClick={::this.toggleDialog} >
							Cancel
						</Button>
					</DialogActions>
				</Dialog>
			</div>
		);
	}
	moveToTrash(type, item) {
		const { onDropCard, onDropBoard } = this.props;
		switch (type) {
			case 'SortableListItem':
				return onDropCard(item.container.props.parent, item.index);
			case 'BoardListItem':
				return onDropBoard(item.index);
		}
	}
	toggleDialog() {
		this.setState({
			dialog: !this.state.dialog
		});
	}
	emptyTrash() {
		this.props.onEmptyTrash();
	}
	isDisabled() {
		/// @NOTE
		/// I know its ugly,...
		/// but, should have to seperate this function from view
		const { getTrashCounts, canDrop } = this.props;
		return getTrashCounts() === 0 && !canDrop;
	}
}
