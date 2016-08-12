import cx from 'classnames';
import React, { Component, PropTypes, } from 'react';
import { findDOMNode } from 'react-dom';
import ContentAddIcon from 'material-ui/svg-icons/content/add';
import ContentCopyIcon from 'material-ui/svg-icons/content/content-copy';
import FAB from 'material-ui/FloatingActionButton';
import DragPreview from '../../../../components/dnd/preview';
import Droppable from '../../../../components/dnd/droppable';
import { createScrollSpy } from '../../../../lib/dom-helpers';
import List from '../list';
import Board from '../board';
import css from './boards.scss';

class Boards extends Component {
	static contextTypes = {
		setTitle: PropTypes.func,
		hammer: PropTypes.object,
		router: PropTypes.object,
		intl: PropTypes.object,
	};
	componentWillMount() {
		this.context.setTitle('Boards');
		this.state = {
			fabIcon: 'add',
			fabFront: false,
		};
		this.dispatchMessage = (::this.dispatchMessage);
		this.onFABDragOut = ::this.onFABDragOut;
		this.onFABDragOver = ::this.onFABDragOver;
		this.onFABDrop = ::this.onFABDrop;
	}
	componentDidMount() {
		this.disposeDragHook = this.context.hammer.createHook(
			(::this.onDragStart),
			null,
			(::this.onDragEnd),
		);
		const list = findDOMNode(this.refs.list);
		this.listScrollSpy = createScrollSpy(::this.listLoadMore, list);
		this.listLoadMore();
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
			board,
			cards,
			lists,
		} = this.props;
		let view;
		if (id) {
			view = <Board full={!headerVisibility} id={id} lists={lists} cards={cards} />;
		} else {
			view = <div>Select item</div>;
		}
		const fab = this.renderFAB();
		return (
			<div className={cx(css.root, {
				[css.viewer]: !!id,
				[css['hide-top']]: !headerVisibility,
			}) }>
				<div ref="list" className={css.list}>
					<List activeItem={id} items={board.list} onMessage={this.dispatchMessage} />
				</div>
				<div className={cx(css.overlay, {
					[css.active]: board.renumbering
				})} />
				<div className={css.content}>
					{view}
				</div>
				{fab}
				<DragPreview className={css.preview} />
			</div>
		);
				// <FAB className={cx(css.fab, { [css.front]: fabFront })}
				// 	icon={fabIcon} onMessage={this.dispatchMessage}/>
	}
	listLoadMore() {
		const listElement = findDOMNode(this.refs.list);
		const reachedEnd = listElement.scrollTop + listElement.clientHeight >= listElement.scrollHeight;

		if (!reachedEnd) return;

		const WINDOW_SIZE = 10;
		const { board: {list, counts}, boardActions } = this.props;
		if (list.length < counts) {
			boardActions.load(list.length, WINDOW_SIZE);
		}
	}
	renderFAB() {
		const { fabIcon, fabFront } = this.state;
		
		let icon = null;
		switch (fabIcon) {
			case 'add':
				icon = <ContentAddIcon />;
				break;
			case 'copy':
				icon = <ContentCopyIcon />;
				break;
			default:
				console.warn('Unknown Icon');
		}
		const fabClassName = cx(css.fab, {
			[css.front]: fabFront
		});

		return (
			<Droppable
				onDragOver={this.onFABDragOver}
				onDragOut={this.onFABDragOut}
				onDrop={this.onFABDrop}>
				<FAB className={fabClassName} onClick={this.onFABClick}>
					{icon}
				</FAB>
			</Droppable>
		);
	}
	dispatchMessage(msg, args) {
		switch (msg) {
			case List.EventTypes.DragOver: {
				const { descriptor, target } = args;
				if (descriptor.data.id === target.id) return;
				this.props.boardActions.sort(descriptor.data.id, target.id);
				return;
			}
			case List.EventTypes.TextChange: {
				const { id, name } = args;
				this.props.boardActions.rename(id, name);
				return;
			}
			case List.EventTypes.Delete: {
				const { id } = args;
				this.props.boardActions.remove(id);
				if (this.props.params.id === id) {
					this.context.router.push('/boards');
				}
				return;
			}
			default: {
				console.error('Unhandled Message', msg);
			}
		}
	}
	onFABClick() {
		const { params, listActions, boardActions } = this.props;

		if (params.id) {
			this.props.listActions.create();
		} else {
			this.props.boardActions.create();
		}
	}
	onFABDragOver() {
		this.props.setDim({
			text: 'Copy into new list'
		});
	}
	onFABDragOut() {
		this.props.setDim(null);
	}
	onFABDrop() {
		this.props.setDim(null);
	}
	onDragStart() {
		this.setState({
			fabIcon: 'copy',
			fabFront: true,
		});
	}
	onDragEnd() {
		this.setState({
			fabIcon: 'add',
			fabFront: false,
		});
	}
}

export default Boards;
