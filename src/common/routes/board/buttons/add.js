import cx from 'classnames';
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
	Tooltip,
} from 'react-mdl';

import ItemButton from './item';
import css from './add.scss';

@DropTarget([
	'BoardListItem',
	'SortableListItem',
], {
	drop(props, monitor) {
		props.duplicate(
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
export default class AddButton extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			open: false
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
		const { open } = this.state;
		const menuClasses = cx(css.menu, {
			[css.open]: open
		});
		// const primaryAddIcon = this.state.showAddMenu ? 'note_add' : 'add';
		// const primaryAddAction = this.state.showAddMenu
		// 	? ::this.createBoard : ::this.toggleAddMenu;
		let primaryIcon;
		let primaryAction;
		let label;
		if (open) {
			primaryIcon = 'note_add';
			label = 'New Board';
		} else if (canDrop) {
			primaryIcon = 'control_point_duplicate';
			label = 'Duplicate';
		} else {
			primaryIcon = 'add';
			primaryAction = ::this.toggleAddMenu;
			label = 'Add';
		}
		return connectDropTarget(
			<div style={{display: 'inline-block'}}>
				<Tooltip label={label} position="left" id="fab-menu-add">
					<FABButton accent={isOver && canDrop}
						className={className}
						style={style}
						onClick={primaryAction} >
						<Icon name={primaryIcon} />
					</FABButton>
				</Tooltip>
				<div className={menuClasses}>
					<ItemButton label="Location" icon="add_location" id="fab-menu-add-location" />
					<ItemButton label="Time" icon="add_alarm" id="fab-menu-add-time" />
					<ItemButton label="Person" icon="person_add" id="fab-menu-add-person" />
					<ItemButton label="Image" icon="add_a_photo" id="fab-menu-add-image" />
				</div>
				<div onClick={() => this.setState({ open: false })}
					className={cx(css.back, open ? css.open : null)} />
			</div>
		);
	}
	toggleAddMenu() {
		this.setState({
			open: !this.state.showAddMenu
		});
	}
}
