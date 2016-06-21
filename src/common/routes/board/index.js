import cx from 'classnames';
import Rx from 'rx';
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';

import Board from '../../models/board';
import DragDropContext from '../../components/drag-drop-context';
import BoardItemList, { dragItemType } from '../../components/board';
import TightGrid from '../../components/tight-grid';

import css from './style.scss';

console.log(dragItemType);

@connect(null, (dispatch) => ({
	setTitle(title) {
		dispatch({ type: 'setTitle', payload: title });
	},
}))
@DragDropContext('BoardDetailItem', createDropEventHandler())
export default class BoardView extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			items: Board.all(),
		};
	}
	componentWillMount() {
		this.props.setTitle('Board Impl2');
		this._childRenderer = (props) => {
			const item = props.data;
			return (<div>
				<div className={css['item-header']}>{item.name}</div>
				<BoardItemList data={Board.getDetails(item.id)}
					notifyPreviewChanged={::this.props.onPreviewChanged} />
			</div>);
		};
	}
	render() {
		const { connectDropTarget, dropTargetMonitor } = this.props;
		let preview = null;
		if (this.props.preview && dropTargetMonitor.getItemType() !== undefined) {
			const Layer = this.props.preview.layer;
			const renderer = this.props.preview.renderer;
			preview = <Layer component={renderer} className={css.preview}/>;
		}
		return connectDropTarget(
			<div className={cx('mdl-layout__content', css.root)}>
				<TightGrid className={css.list}
					items={this.state.items}
					childElement={this._childRenderer}
					childClass={cx(css.item, 'mdl-shadow--2dp')}>
					{preview}
				</TightGrid>
			</div>
		);
	}
}

function createDropEventHandler() {
	return {
		hover(props, monitor, component) {
			// Scroll on edge
			const dom = findDOMNode(component);
			const bound = dom.getBoundingClientRect();
			const cursor = monitor.getSourceClientOffset();
			const edgeHeight = Math.floor(bound.height * 0.1);
			const top = bound.top + edgeHeight;
			const bottom = bound.height - edgeHeight;
			clearInterval(component._hoverScroll);

			if (cursor.y <= top) {
				component._hoverScroll = setInterval(() => {
					dom.scrollTop += cursor.y - top;
				});
				return;
			}
			if (cursor.y >= bottom) {
				component._hoverScroll = setInterval(() => {
					dom.scrollTop += cursor.y - bottom;
				}, 30);
				return;
			}
		},
		drop(drop, monitor, component) {
			clearInterval(component._hoverScroll);
			console.log(monitor.didDrop());
			return;
		},
	};
}

