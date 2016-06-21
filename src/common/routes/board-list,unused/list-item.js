import React, { Component, PropTypes } from 'react';
import { FormattedRelative } from 'react-intl';
import { Link } from 'react-router';

export default class BoardListItem extends Component {
	static propTypes = {
		style: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
	};
	render() {
		const { data, style } = this.props;
		const { id, name, createdAt, text } = data;
		const link = `/board/${id}`;
		return (
			<div className="item mdl-shadow--2dp" style={style}>
				<Link to={link}>
					<div className="header">{name}</div>
					<p>{text}</p>
					<div><FormattedRelative value={createdAt} /></div>
				</Link>
			</div>
		);
	}
}

// import cx from 'classnames';
// import { findDOMNode } from 'react-dom';
// import { DragSource, DropTarget, DragLayer } from 'react-dnd';

// const mapDragSpecToProps = {
// 	beginDrag(props) {
// 		return props.data;
// 	}
// };

// const mapDropSpecToProps = {
// 	canDrop(props, monitor) {
// 		return props.data.name !== monitor.getItem().name;
// 	},
// 	hover(props, monitor, component) {
// 		if (!monitor.canDrop()) {
// 			return;
// 		}
// 		// const domElement = findDOMNode(component);
// 		// const clientOffset = monitor.getClientOffset();
// 		// // {top: 56, right: 206, bottom: 262, left: 0, width: 206…}
// 		// const boundRect = domElement.getBoundingClientRect();
// 		// const height = boundRect.bottom - boundRect.top;
// 		// const width = boundRect.right - boundRect.left;
// 		// const delta = {
// 		// 	x: boundRect.left + width / 2 - clientOffset.x,
// 		// 	y: boundRect.top + height / 2 - clientOffset.y
// 		// };
// 		// const push = {
// 		// 	x: 0,
// 		// 	y: 0
// 		// };
// 		// const margin = 20;
// 		// const marginW = width / 2 - margin;
// 		// const marginH = height / 2 - margin;
// 		// if (delta.x < -marginW) {
// 		// 	push.x = -1;
// 		// }
// 		// if (delta.x > marginW) {
// 		// 	push.x = 1;
// 		// }
// 		// if (delta.y > -marginH) {
// 		// 	push.y = -1;
// 		// }
// 		// if (delta.y < marginH) {
// 		// 	push.y = 1;
// 		// }
// 		// console.log(clientOffset, push);

// 		// push right
// 		// if (boundRect.left + width / 2 < clientOffset.x) {
// 		// 	props.move(props.data.name, -1, 0);
// 		// 	return;
// 		// }
// 		// if (boundRect.top + height / 2 < clientOffset.y) {
// 		// 	props.move(props.data.name, 0, 1);
// 		// 	return;
// 		// }
// 		// console.log('Hover', props.data.name, );
// 		// monitor.
// 	}
// };

// function mapDragCollectToProps(connect, monitor) {
// 	return {
// 		connectDragSource: connect.dragSource(),
// 		isDragging: monitor.isDragging(),
// 	};
// }

// function mapDropCollectToProps(connect, monitor) {
// 	return {
// 		connectDropTarget: connect.dropTarget(),
// 		isOver: monitor.isOver({ shallow: true }),
// 		canDrop: monitor.canDrop(),
// 	};
// }

// function mapLayerCollectToProps(monitor) {
// 	return {
// 		clientOffset: monitor.getClientOffset(),
// 		sourceClientOffset: monitor.getSourceClientOffset(),
// 		differenceFromInitialOffset: monitor.getDifferenceFromInitialOffset(),
// 		initialClientOffset: monitor.getInitialClientOffset(),
// 		initialSourceClientOffset: monitor.getInitialSourceClientOffset(),
// 		isDragging: monitor.isDragging(),
// 	};
// }

// function createGuide(name, point, color) {
// 	return null;
// 	// return <div className={'guide ' + color} style={{
// 	// 	left: point.x,
// 	// 	top: point.y - 60
// 	// }} >{name} ({point.x}, {point.y})</div>;
// }
// /// @TODO: make this to stateless component after finish dev
// // @DragLayer(mapLayerCollectToProps)
// // class BoardListItemDragPreview extends Component {
// // 	render() {
// // 		let {
// // 			data,
// // 			isDragging,
// // 			clientOffset,
// // 			sourceClientOffset,
// // 			differenceFromInitialOffset,
// // 			initialClientOffset,
// // 			initialSourceClientOffset,
// // 		} = this.props;
// // 		const { name, text, createdAt } = data;
// // 		if (!isDragging || !sourceClientOffset) {
// // 			return null;
// // 		}

// // 		const {x, y} = sourceClientOffset;
// // 		const transform = `translate(${x}px, ${y}px)`;
// // 		const style = {
// // 			transform,
// // 			WebkitTransform: transform,
// // 			MozTransform: transform,
// // 			MSTransform: transform,
// // 			OTransform: transform
// // 		};
// // 		// mouse click delta
// // 		const clientOffsetPoint = createGuide('clientOffset', clientOffset, 'red');
// // 		// client delta
// // 		const sourceClientOffsetPoint = createGuide('sourceClientOffset', sourceClientOffset, 'cyan');
// // 		// anchor delta
// // 		const differenceFromInitialOffsetPoint = createGuide('differenceFromInitialOffset', differenceFromInitialOffset, 'blue');
// // 		// initial mouse click
// // 		const initialClientOffsetPoint = createGuide('initialClientOffset', initialClientOffset, 'green');
// // 		// initial anchor
// // 		const initialSourceClientOffsetPoint = createGuide('initialSourceClientOffset', initialSourceClientOffset, 'purple');
// // 		return (
// // 			<div>
// // 			<div className="item preview-layer" style={style}>
// // 				<h2>{name}</h2>
// // 				<p>{text}</p>
// // 				<div>{Date(createdAt).toLocaleString()}</div>
// // 			</div>
// // 				{clientOffsetPoint}
// // 				{sourceClientOffsetPoint}
// // 				{differenceFromInitialOffsetPoint}
// // 				{initialClientOffsetPoint}
// // 				{initialSourceClientOffsetPoint}

// // 			</div>
// // 		);
// // 	}
// // }
// // @DragSource('BoardListItem', mapDragSpecToProps, mapDragCollectToProps)
// // @DropTarget('BoardDetailItem', mapDropSpecToProps, mapDropCollectToProps)
// // export default class BoardListItem extends Component {
// // 	static propTypes = {
// // 		onPreviewChanged: PropTypes.func.isRequired,
// // 		style: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
// // 	};
// // 	componentWillReceiveProps(nextProps) {
// // 		if (this.props.isDragging !== nextProps.isDragging) {
// // 			if (nextProps.isDragging) {
// // 				nextProps.onPreviewChanged({
// // 					renderable: BoardListItemDragPreview,
// // 					data: this.props.data
// // 				});
// // 			}
// // 		}
// // 	}
// // 	render() {
// // 		const { connectDragSource, connectDropTarget, data, isOver, isDragging, canDrop, style } = this.props;
// // 		const { name, createdAt, text } = data;
// // 		const classes = cx('item', {
// // 			isOver, canDrop
// // 		});
// // 		let styles = Object.assign({}, style, {
// // 			opacity: isDragging ? 0 : 1
// // 		});
// // 		return connectDropTarget(connectDragSource(
// // 			<div className={classes} style={styles}>
// // 				<h2>{name}</h2>
// // 				<p>{text}</p>
// // 				<div>{Date(createdAt).toLocaleString()}</div>
// // 			</div>
// // 		));
// // 	}
// // }
