import React, { Component } from 'react';
import { DragDropContext, DropTarget } from 'react-dnd';
import TouchBackend from 'react-dnd-touch-backend';

export default function DragDropContextEx(types, spec) {
	return (ComposedComponent) => {
		@DragDropContext(TouchBackend({ enableMouseEvents: true }))
		@DropTarget(types, spec, (connect, monitor) => ({
			connectDropTarget: connect.dropTarget(),
			dropTargetMonitor: monitor
		}))
		class DragDropContextEx extends Component {
			constructor(props, context) {
				super(props, context);
				this.state = {
					preview: null
				};
			}
			componentWillReceiveProps(nextProps) {
				if (nextProps.dragItemType !== this.props.dragItemType) {
					if (!nextProps.dragItemType) {
						this.setState({
							preview: null
						});
					}
				}
			}
			onPreviewChanged(layer, renderer) {
				this.setState({
					preview: {
						layer,
						renderer
					}
				});
			}
			render() {
				return (
					<ComposedComponent preview={this.state.preview} {...this.props}
						onPreviewChanged={::this.onPreviewChanged}/>
				);
			}
		}
		return DragDropContextEx;
	};
}
