import Rx from 'rx';
import React, { Component, PropTypes, } from 'react';
import Subheader from 'material-ui/Subheader';
import { List } from 'material-ui/List';
import DragDropContainer from '../../lib/dnd/container';
import DragPreview from '../../lib/dnd/preview';
import BoardList from './components/board-list';
import View from './components/view';
import FAB from './components/fab';
import cx from 'classnames';
import css from './styles/boards.scss';

class Boards extends Component {
	static contextTypes = {
		setTitle: PropTypes.func,
	};
	componentWillMount() {
		this.context.setTitle('Boards');
	}
	render() {
		const { id } = this.props.params;
		let view;
		if (id) {
			view = <View full={!this.props.headerVisibility} params={{id}}/>;
		} else {
			view = <div>Select item</div>;
		}
		return (
			<DragDropContainer>
				<div className={cx(css.root, {
					[css.viewer]: !!this.props.params.id,
					[css['hide-top']]: !this.props.headerVisibility,
				}) }>
					<div className={css.list}>
						<List>
							<Subheader>Board</Subheader>
							<BoardList list={this.props.board.list} />
						</List>
					</div>
					<div className={css.content}>
						{view}
					</div>
					<FAB className={css.fab}/>
					<DragPreview/>
				</div>
			</DragDropContainer>
		);
	}
}

export default Boards;