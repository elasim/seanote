import React, { Component, PropTypes } from 'react';
import { DragSource } from 'react-dnd';

export default function Draggable(type, preview) {
	return function (ComposedComponent) {
		@DragSource(type, {
			beginDrag(props) {
				return props.data;
			}
		}, (connect, monitor) => ({
			connectDragSource: connect.dragSource(),
			isDragging: monitor.isDragging(),
		}))
		class DraggableComponent extends Component {
			static propTypes = {
				notifyPreviewChanged: PropTypes.func.isRequired
			};
			componentWillReceiveProps(nextProps) {
				if (!this.props.isDragging && nextProps.isDragging) {
					nextProps.notifyPreviewChanged(this, preview);
					return;
				}
			}
			render() {
				return <ComposedComponent {...this.props} />;
			}
		}
		return DraggableComponent;
	};
}
