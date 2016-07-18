import cx from 'classnames';
import React, { Component, PropTypes, } from 'react';
import { findDOMNode } from 'react-dom';
import ContentCopyIcon from 'material-ui/svg-icons/content/content-copy';
import DragPreview from '../../lib/dnd/preview';
import { createScrollSpy } from '../../lib/dom-helpers';
import List from './components/list';
import View from './components/view';
import FAB from './components/fab';
import css from './styles/boards.scss';

class Boards extends Component {
	static contextTypes = {
		setTitle: PropTypes.func,
		hammer: PropTypes.object,
	};
	componentWillMount() {
		this.context.setTitle('Boards');
		this.state = {
			fabIcon: null,
			fabFront: false,
		};
		this.handleBoardListEvent = ::this.handleBoardListEvent;
		this.handleFabEvent = ::this.handleFabEvent;
	}
	componentDidMount() {
		this.disposeDragHook = this.context.hammer.createHook(
			::this.onDragStart,
			null,
			::this.onDragEnd,
		);
		const list = findDOMNode(this.refs.list);
		this.listScrollSpy = createScrollSpy(::this.listLoadMore, list);
		window.scrollTo(0, 1);
	}
	componentWillUnmount() {
		this.disposeDragHook();
		this.listScrollSpy.dispose();
	}
	render() {
		const {
			params: { id },
			headerVisibility,
			list,
			listActions,
			board,
			params,
		} = this.props;
		const { fabIcon, fabFront } = this.state;
		let view;
		if (id) {
			view = <View full={!headerVisibility} id={id} data={list} actions={listActions}/>;
		} else {
			view = <div>Select item</div>;
		}
		return (
			<div className={cx(css.root, {
				[css.viewer]: !!params.id,
				[css['hide-top']]: !headerVisibility,
			}) }>
				<div ref="list" className={css.list}>
					<List activeItem={id} list={board.list} onMessage={this.handleBoardListEvent} />
				</div>
				<div className={cx(css.overlay, {
					[css.active]: board.renumbering
				})} />
				<div className={css.content}>
					{view}
				</div>
				<FAB className={cx(css.fab, { [css.front]: fabFront })}
					icon={fabIcon} onMessage={this.handleFabEvent}/>
				<DragPreview className={css.preview} />
			</div>
		);
	}
	listLoadMore() {
		const listElement = findDOMNode(this.refs.list);
		const reachedEnd = listElement.scrollTop + listElement.clientHeight >= listElement.scrollHeight;

		if (!reachedEnd) return;

		const WINDOW_SIZE = 10;
		const { board: {list, counts}, boardAction } = this.props;
		if (list.length < counts) {
			boardAction.load(list.length, WINDOW_SIZE);
		}
	}
	handleBoardListEvent(type, args) {
		switch (type) {
			case List.EventTypes.DragOver: {
				const [descriptor, drop] = args;
				if (descriptor.data.id === drop.id) return;
				this.props.boardAction.sort(descriptor.data.id, drop.id);
				return;
			}
			default:
				return;
		}
	}
	handleFabEvent(type, args) {
		switch (type) {
			case FAB.EventTypes.DragOver: {
				return this.props.setDim({
					icon: null,
					text: 'Copying a this item',
				});
			}
			case FAB.EventTypes.Drop: {
				const [, descriptor] = args;
				console.log('Drop', descriptor);
				return this.props.setDim(null);
			}
			case FAB.EventTypes.DragOut: {
				return this.props.setDim(null);
			}
			case FAB.EventTypes.Open: {
				this.props.setDim({
					onClick: args.dimClick,
				});
				this.setState({
					fabFront: true,
				});
				return;
			}
			case FAB.EventTypes.Close: {
				this.props.setDim(null);
				this.setState({
					fabFront: false,
				});
				return;
			}
		}
	}
	onDragStart() {
		this.setState({
			fabIcon: ContentCopyIcon,
			fabFront: true,
		});
	}
	onDragEnd() {
		this.setState({
			fabIcon: null,
			fabFront: false,
		});
	}
}

export default Boards;
