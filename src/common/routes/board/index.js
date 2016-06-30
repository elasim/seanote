import cx from 'classnames';
import React, { Children, Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import SortableList from '../../components/sortable-list';
import * as BoardAction from '../../actions/board';

import {
	Button, Card, CardTitle, CardActions,
	IconButton,
	Grid, Cell,
	Icon,
} from 'react-mdl';
import css from './style.scss';

@DragDropContext(HTML5Backend)
class BoardView extends Component {
	static contextTypes = {
		setTitle: PropTypes.func.isRequired,
	};
	static propTypes = {
		action: PropTypes.object,
		items: PropTypes.array,
	};
	static defaultProps = {
		action: {},
		items: [],
	};
	constructor(...args) {
		super(...args);
		this.state = {
			view: null,
			hideList: false,
			items: [1,2,3,4,5,6,7,8,9,10].map(v => ({id:v})),
		};
		this.onListMove = ::this.onListMove;
		this.onToggleList = ::this.onToggleList;
	}
	componentWillMount() {
		this.context.setTitle('Board');
	}
	componentDidMount() {
		// connect ws
	}
	componentWillUnmount() {
		// disconnect ws
	}
	render() {
		const view = this.props.params.id === undefined;
		const hide = this.state.hideList;
		const viewCol = {
			col: 9 + (hide ? 3 : 0),
			tablet: 4 + (hide ? 4 : 0),
		};
		const template = (props) => {
			const { connectDragSource, value } = props;
			const link = `/board/${value.id}`;
			return (
				<div className={cx('mdl-shadow--2dp', css.item)}>
						<div className={css.header}>
							{connectDragSource(
								<div className={css.handle}>
									<Icon name="drag_handle" />
								</div>
							)}
							<Link to={link} className={css.title}>
								{value.id}
							</Link>
							<div className={css.more}>
								<IconButton name="more_vert"/>
							</div>
						</div>
						<div className={css.content}>
							<Button><Icon name="view_column" /> 0</Button>
							<Button><Icon name="person" /> 0</Button>
						</div>
				</div>
			);
		};
		return (
			<div className={cx('mdl-layout__content', css.root)}>
				<Grid className={css.container} noSpacing>
					<Cell col={3} tablet={4} phone={8} hidePhone={!view}
						hideTablet={hide} hideDesktop={hide}
						className={css.list}>
						<SortableList items={this.state.items} keyName="id"
							ref="list"
							style={{width: 'auto', padding: 5}}
							template={template}
							disableHandle
							onDragMove={this.onListMove} />
					</Cell>
					<Cell col={viewCol.col} tablet={viewCol.tablet} phone={8}
						hidePhone={view} className={css.col}>
						<div className={cx(css.fold, hide ? css['full-width']:null)}>
							<IconButton name="view_list" onClick={this.onToggleList} />
						</div>
						{this.props.children}
					</Cell>
				</Grid>
			</div>
		);
	}
	onToggleList() {
		this.setState({
			hideList: !this.state.hideList
		});
	}
	onListMove(src, dst) {
		const items = [].concat(this.state.items);
		const data = items[src];
		items.splice(src, 1);
		items.splice(dst, 0, data);
		this.setState({ items });
	}
}

export default connect(null, null)(BoardView);
