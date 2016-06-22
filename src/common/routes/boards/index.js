import cx from 'classnames';
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';

import BoardData from '../../models/board';
import DragDropContext from '../../components/drag-drop-context';
import CascadeGrid from '../../components/cascade-grid';

import GridItemTemplate from './grid-item-template';
import { dragType } from './constant';
import css from './style.scss';
import SEODocumentTitle from '../../components/seo-document-title/decorator';

@SEODocumentTitle('Board')
@connect(null, (dispatch) => ({
	setTitle: (title) => dispatch({ type: 'setTitle', payload: title })
}))
@DragDropContext(dragType, createDropEventHandler())
export default class Boards extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			items: BoardData.all(),
		};
	}
	componentWillMount() {
	//	this.props.setTitle('Board');
	}
	render() {
		const {
			connectDropTarget,
			dropTargetMonitor,
			preview
		} = this.props;
		let previewRendered = null;
		const dragItemType = dropTargetMonitor.getItemType();
		if (preview && dragItemType !== undefined) {
			previewRendered = React.createElement(preview.layer, {
				component: preview.renderer,
				className: css.preview
			});
		}
		return connectDropTarget(
			<div className={cx('mdl-layout__content', css.root)}>
				<CascadeGrid columnWidth={220} items={this.state.items}
					itemTemplate={GridItemTemplate} >
				</CascadeGrid>
				{previewRendered}
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
			return;
		},
	};
}
