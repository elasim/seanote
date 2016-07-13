import React, { Component, PropTypes, } from 'react';
import Subheader from 'material-ui/Subheader';
import { List } from 'material-ui/List';
import ContentCopyIcon from 'material-ui/svg-icons/content/content-copy';
import injectHammer from '../../lib/dnd/inject-hammer';
import DragPreview from '../../lib/dnd/preview';
import BoardList from './components/board-list';
import View from './components/view';
import FAB from './components/fab';
import cx from 'classnames';
import css from './styles/boards.scss';

@injectHammer()
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
	}
	componentWillUnmount() {
		this.disposeDragHook();
	}
	render() {
		const {
			params: { id },
			headerVisibility,
		} = this.props;
		const { fabIcon, fabFront } = this.state;
		let view;
		if (id) {
			view = <View full={!headerVisibility} id={id}/>;
		} else {
			view = <div>Select item</div>;
		}
		return (
			<div className={cx(css.root, {
				[css.viewer]: !!this.props.params.id,
				[css['hide-top']]: !this.props.headerVisibility,
			}) }>
				<div className={css.list}>
					<List>
						<Subheader>Board</Subheader>
						<BoardList list={this.props.board.list} onMessage={this.handleBoardListEvent} />
					</List>
				</div>
				<div className={css.content}>
					{view}
				</div>
				<FAB className={cx(css.fab, {
					[css.front]: fabFront,
				})} icon={fabIcon} onMessage={this.handleFabEvent}/>
				<DragPreview/>
			</div>
		);
	}
	handleBoardListEvent(type, args) {
		switch (type) {
			case BoardList.EventTypes.DragOver: {
				const [descriptor, drop] = args;
				if (descriptor.data.id === drop.id) return;
				this.props.sort(descriptor.data.id, drop.id);
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