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
		if (open) {
			primaryIcon = 'note_add';
		} else if (canDrop) {
			primaryIcon = 'control_point_duplicate';
		} else {
			primaryIcon = 'add';
			primaryAction = ::this.toggleAddMenu;
		}
		return connectDropTarget(
			<div style={{display: 'inline-block'}}>
				<FABButton
					onClick={primaryAction}
					onTouchTap={primaryAction}
					accent={isOver && canDrop}
					className={className}
					style={style}
				>
					<Icon name={primaryIcon} />
				</FABButton>
				<div className={menuClasses}>
					<ItemButton icon="add_location" />
					<ItemButton icon="add_alarm" />
					<ItemButton icon="person_add" />
					<ItemButton icon="add_a_photo" />
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
