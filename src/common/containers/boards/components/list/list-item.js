import cx from 'classnames';
import isEqual from 'lodash/isEqual';
import React, { PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import Link from 'react-router/lib/Link';
import MenuItem from 'material-ui/MenuItem';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import ComponentEx from '../../../../components/component';
import EditableContent from '../../../../components/editable-content';
import Droppable from '../../../../components/dnd/droppable';
import Draggable from '../../../../components/dnd/draggable';
import Symbol from '../../../../lib/symbol-debug';
import Preview from '../preview';
import css from './list-item.scss';

const EventTypes = {
	DragOver: Symbol('BoardListItem.DragOver'),
	TextChange: Symbol('BoardListItem.TextChange'),
	DeleteMenuClick: Symbol('BoardListItem.DeleteMenuClick'),
	ShareMenuClick: Symbol('BoardListItem.ShareMenuClick'),
	SettingsMenuClick: Symbol('BoardListItem.SettingMenuClick'),
};

class NoteListItem extends ComponentEx {
	static EventTypes = EventTypes;
	static propTypes = {
		data: PropTypes.object,
		active: PropTypes.bool,
		style: PropTypes.object,
		className: PropTypes.string,
	};
	static contextTypes = {
		intl: PropTypes.object,
	};
	componentWillMount() {
		this.state = {
			width: 0,
			height: 0,
		};
		this.onDragOver = ::this.onDragOver;
		this.onTextChanged = ::this.onTextChanged;
		this.onSettingMenuClick = ::this.onSettingMenuClick;
		this.onDeleteMenuClick = ::this.onDeleteMenuClick;
		this.onShareMenuClick = ::this.onShareMenuClick;
	}
	componentDidMount() {
		const { width, height } = this.state;
		const rect = findDOMNode(this).getBoundingClientRect();
		if (rect.width !== width || rect.height !== height) {
			this.setState({
				width: rect.width,
				height: rect.height,
			});
		}
	}
	shouldComponentUpdate(nextProps, nextState) {
		// eslint-disable-next-line no-unused-vars
		const { data, children, ...otherProps} = this.props;
		for (const key in otherProps) {
			if (nextProps[key] !== otherProps[key]) {
				return true;
			}
		}
		if (!isEqual(data, nextProps.data)) {
			return true;
		}
		if (!isEqual(this.state, nextState)) {
			return true;
		}
		return false;
	}
	render() {
		const { data, active, style, className } = this.props;
		const { width, height } = this.state;
		const { intl } = this.context;

		const rootClassName = cx(className, css.root, {
			[css.active]: active
		});
		const preview = (<Preview width={width} height={height} />);
		const iconButtonElement = (
			<IconButton>
				<FontIcon className="material-icons">&#xE5D4;</FontIcon>
			</IconButton>
		);
		const menuStyle = {
			cursor: 'pointer'
		};
		return (
			<Droppable onDragOver={this.onDragOver}>
				<div style={style} className={rootClassName}>
					<Draggable data={data} preview={preview} type="board">
						<div className={css.handle}>
							<FontIcon className="material-icons">&#xE25D;</FontIcon>
						</div>
					</Draggable>
					<div className={css.menu}>
						<IconMenu iconButtonElement={iconButtonElement}
							useLayerForClickAway={true}>
							<MenuItem style={menuStyle} onClick={this.onSettingMenuClick}>
								Setting
							</MenuItem>
							<MenuItem style={menuStyle} onClick={this.onShareMenuClick}>
								Share
							</MenuItem>
							<MenuItem style={menuStyle} onClick={this.onDeleteMenuClick}>
								Delete
							</MenuItem>
						</IconMenu>
					</div>
					<Link to={`/boards/${data.id}`}>
						<EditableContent value={data.name} onChanged={this.onTextChanged}
							className={css.primary} />
						<p className={css.secondary}>
							{intl.formatRelative(data.updatedAt)}
						</p>
					</Link>
				</div>
			</Droppable>
		);
	}
	onShareMenuClick() {
		this.sendMessage(EventTypes.ShareMenuClick, {
			id: this.props.data.id
		});
	}
	onDeleteMenuClick() {
		this.sendMessage(EventTypes.DeleteMenuClick, {
			id: this.props.data.id
		});
	}
	onSettingMenuClick() {
		this.sendMessage(EventTypes.SettingMenuClick, {
			id: this.props.data.id
		});
	}
	onDragOver(event, descriptor) {
		this.sendMessage(EventTypes.DragOver, {
			event,
			descriptor,
			target: this.props.data
		});
	}
	onTextChanged(sender, nextText) {
		if (!nextText || nextText.trim().length === 0) {
			return false;
		}
		this.sendMessage(EventTypes.TextChange, {
			id: this.props.data.id,
			name: nextText
		});
		return true;
	}
}

export default NoteListItem;
