import Rx from 'rx';
import React, { Component, PropTypes, } from 'react';
import browserHistory from 'react-router/lib/browserHistory';
import Subheader from 'material-ui/Subheader';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import FontIcon from 'material-ui/FontIcon';
import DragDropContainer from '../../lib/dnd/container';
import DragPreview from '../../lib/dnd/preview';
import Droppable from '../../lib/dnd/droppable';
import Draggable from '../../lib/dnd/draggable';
import { createScrollSpy, getViewportHeight } from '../../lib/dom-helpers';
import cx from 'classnames';
import css from './boards.scss';
import pure from 'recompose/pure';
const iconButtonElement = (
	<IconButton iconClassName="material-icons">
		&#xE5D4;
	</IconButton>
);
const iconMenu = (
	<IconMenu iconButtonElement={iconButtonElement}
		useLayerForClickAway={true}>
		<MenuItem style={{ WebkitAppearance: 'none' }}>See details</MenuItem>
		<MenuItem style={{ WebkitAppearance: 'none' }}>Setting</MenuItem>
		<MenuItem style={{ WebkitAppearance: 'none' }}>Share</MenuItem>
		<MenuItem style={{ WebkitAppearance: 'none' }}>Delete</MenuItem>
	</IconMenu>
);
const dragHandle = (
	<FontIcon className="material-icons">&#xE25D;</FontIcon>
);

const ItemList = pure(class extends Component {
	static propTypes = {
		list: PropTypes.array.isRequired,
	};
	render() {
		const { list } = this.props;
		const items = list
			.map(v => {
				const preview = (
					<ListItem
						primaryText={v.toString()}
						leftIcon={dragHandle}
					/>
				);
				const draggableHandle = (
					<Draggable preview={preview}>{dragHandle}</Draggable>
				);
				const props = {
					leftIcon: draggableHandle,
					rightIconButton: iconMenu,
					primaryText: v.toString(),
					ref: `list-item-${v}`,
					onClick() {
						this::open(v);
					},
				};
				return (
					<Droppable key={v}
						onDragOver={({ descriptor }) => {}}
						onDrop={() => { console.log(v); }} >
						<ListItem {...props} />
					</Droppable>
				);
			});
		return <div>{items}</div>;
	}
});

class Boards extends Component {
	static contextTypes = {
		setTitle: PropTypes.func,
	};
	componentWillMount() {
		const list = new Array();
		for (let i = 0; i < 24; ++i) list.push(i);
		this.state = {
			list,
		};
		this.context.setTitle('Boards');
	}
	componentDidMount() {
		const _adjustLayout = this::adjustLayout;
		this.resizeSpy = createScrollSpy(_adjustLayout, getViewportHeight);
		_adjustLayout();
	}
	componoentWillUnmount() {
		this.resizeSpy.dispose();
	}
	render() {
		return (<DragDropContainer>
			<div className={cx(css.root, {
				[css.viewer]: !!this.props.params.id,
				[css['hide-top']]: !this.state.showHeader,
			}) }>
				<div className={css.list}>
					<List>
						<Subheader>Board</Subheader>
						<ItemList list={this.state.list} />
					</List>
				</div>
				<div className={css.content}>
					{this.props.children}
				</div>
				<DragPreview/>
			</div>
		</DragDropContainer>);
					//<ListView list={this.state.list} />
	}
}

// Use Same adjusting logic to avoid rendering propagation
// Rerender process will break css animation
function adjustLayout() {
	const top = document.body.scrollTop;

	// portrait or too small to show header
	if (getViewportHeight() <= 400) {
		const showHeader = top === 0;
		if (this.state.showHeader !== showHeader) {
			this.setState({ showHeader });
		}
	} else if (!this.state.showHeader) {
		this.setState({ showHeader: true });
	}
}

function open(val) {
	browserHistory.push(`/boards/${val}`);
}

export default Boards;