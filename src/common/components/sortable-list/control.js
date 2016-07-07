import Rx from 'rx';
import React, { Component, PropTypes } from 'react';
import emptyFunction from 'fbjs/lib/emptyFunction';
import { DragSource, DropTarget } from 'react-dnd';
import css from './style.scss';

export default class SortableList extends Component {
	static propTypes = {
		items: PropTypes.arrayOf(PropTypes.object).isRequired,
		keyName: PropTypes.string.isRequired,
		style: PropTypes.object,
		className: PropTypes.string,
		onDragMove: PropTypes.func,
		onDragOut: PropTypes.func,
		onDragIn: PropTypes.func,
		allowIn: PropTypes.bool,
		allowOut: PropTypes.bool,
		//properties defined in below will pass into items.
		disableHandle: PropTypes.bool,
		disablePreview: PropTypes.bool,
		template: PropTypes.func,
	};
	static defaultProps = {
		onDragMove: emptyFunction,
		onDragOut: emptyFunction,
		onDragIn: emptyFunction,
		allowIn: false,
		allowOut: false,
	};
	render() {
		const {
			items,
			keyName,
			className,
			style,
			disableHandle,
			disablePreview,
			template,
		} = this.props;
		const renderedItems = items.map((item, i) => {
			return (
				<SortableListItem value={item} index={i} container={this}
					key={'sortable-list-key-' + item[keyName]}
					{...{disableHandle, disablePreview, template}} />
			);
		});
		return (
			<div className={className} style={style}>
				{renderedItems}
			</div>
		);
	}
}

@DragSource('SortableListItem',
	{
		beginDrag(props) {
			const { keyName } = props.container.props;
			return {
				// It required to identify dragging state
				key: props.value[keyName],
				container: props.container,
				index: props.index,
			};
		},
	},
	(connect) => ({
		connectDragSource: connect.dragSource(),
		connectDragPreview: connect.dragPreview(),
	})
)
@DropTarget('SortableListItem',
	{
		hover(props, monitor, component) {
			if (component && component.onHover) {
				component.hoverEvent$.onNext({ props, item: monitor.getItem() });
			}
		}
	},
	(connect, monitor) => ({
		connectDropTarget: connect.dropTarget(),
		dragItem: monitor.getItem(),
	})
)
class SortableListItem extends Component {
	static propTypes = {
		value: PropTypes.object.isRequired,
		disableHandle: PropTypes.bool,
		disablePreview: PropTypes.bool,
		template: PropTypes.func,
	};
	static defaultProps = {
		template: (props) => (
			<div>{JSON.stringify(props.value.id)}</div>
		),
		disableHandle: false,
		disablePreview: false,
	}
	constructor(props, context) {
		super(props, context);
	}
	componentDidMount() {
		this.hoverEvent$ = new Rx.Subject();
		this.hoverEventSubscription = this.hoverEvent$
			.throttle(1000)
			.subscribe((param) => this.onHover(param.props, param.item));
	}
	componentWillUnmount() {
		this.hoverEvent$.dispose();
		this.hoverEventSubscription.dispose();
	}
	render() {
		const {
			connectDropTarget,
			connectDragSource,
			connectDragPreview,
			dragItem,
			container,
			template,
			disableHandle,
			disablePreview,
			value
		} = this.props;
		const style = {
			opacity: 1,
			transition: 'opacity 0.2s linear',
		};
		// Its dragging or draging over container
		if (dragItem && dragItem.key === value[container.props.keyName]) {
			style.opacity = 0;
		}
		let handle;
		let rendered;
		if (!disableHandle) {
			handle = connectDragSource(
				<div className={css.handle}>
					<i className="material-icons">drag_handle</i>
				</div>
			);
			rendered = connectDropTarget(
				<div className={css.item} style={style}>
					{handle}
					<div className={css.body}>
						{React.createElement(template, this.props)}
					</div>
				</div>
			);
		} else {
			rendered = connectDropTarget(<div style={{width:'100%'}}>
				{React.createElement(template, this.props)}
			</div>);
		}
		if (!disablePreview) {
			rendered = connectDragPreview(rendered);
		}
		return rendered;
	}
	onDrop() {}
	onHover(props, item) {
		const dragSrc = item;
		const srcIdx = dragSrc.index;
		const dstIdx = props.index;
		let moveContainer = false;

		if (props.container !== dragSrc.container) {
			const destAllowIn = props.container.props.allowIn;
			const srcAllowOut = dragSrc.container.props.allowOut;
			moveContainer = destAllowIn && srcAllowOut;
			if (!moveContainer) {
				return;
			}
		} else {
			if (srcIdx === dstIdx) {
				return;
			}
		}
		// Updating property is not responsible of this component.
		// Only notify them to update data
		if (moveContainer) {
			const dstItem = props.container.props.items[dstIdx];
			props.container.props.onDropOver(dstIdx, dstItem);
		} else {
			dragSrc.container.props.onDragMove(srcIdx, dstIdx);
			dragSrc.index = dstIdx;
		}
	}
}
