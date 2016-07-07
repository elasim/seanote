import cx from 'classnames';
import React, { Component } from 'react';
import { Link } from 'react-router';
import {
	Button, Icon, IconButton,
	Tooltip, Menu, MenuItem,
} from 'react-mdl';

import css from './list-item.scss';

export default class ListItemTemplate extends Component {
	render () {
		const { connectDragSource, connectDragPreview, value } = this.props;
		const link = `/board/${value.id}`;
		const boardMenuId = `board-menu-${value.id}`;
		const columnTooltipId = `board-col-${value.id}`;
		const shareTooltipId = `board-share-${value.id}`;
		return connectDragPreview(
			<div className={cx('mdl-shadow--2dp', css.item)}>
				<div className={css.header}>
					{connectDragSource(
						<div className={css.handle}>
							<Icon name="drag_handle" />
						</div>
					)}
					<Link to={link} className={css.title}>
						{value.id}
					</Link>
					<div className={css.more}>
						<IconButton name="more_vert" id={boardMenuId}/>
						<Menu target={boardMenuId} align="right" ripple>
							<MenuItem>Setting</MenuItem>
							<MenuItem>Rename</MenuItem>
							<MenuItem>Share</MenuItem>
							<MenuItem>Delete</MenuItem>
						</Menu>
					</div>
				</div>
				<div className={css.content}>
					<Tooltip label="Lists" id={columnTooltipId}>
					<Button><Icon name="view_column" /> 0</Button>
					</Tooltip>
					<Tooltip label="Shares" id={shareTooltipId}>
						<Button><Icon name="person" /> 0</Button>
					</Tooltip>
				</div>
			</div>
		);
	}
}
