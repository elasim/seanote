import React, { Component, PropTypes } from 'react';
import connect from 'react-redux/lib/components/connect';
import bindActionCreators from 'redux/lib/bindActionCreators';
import flow from 'lodash/flow';
import injectHammer from '../../components/dnd/inject-hammer';
import { setDim } from '../../actions/app';
import BoardActions from '../../actions/board';
import ListActions from '../../actions/list';
import CardActions from '../../actions/card';
import Board from './components/boards';

class BoardContainer extends Component {
	static childContextTypes = {
		board: PropTypes.object,
		list: PropTypes.object,
		card: PropTypes.object,
	};
	getChildContext() {
		return {
			board: this.props.boardActions,
			list: this.props.listActions,
			card: this.props.cardActions,
		};
	}
	render() {
		return <Board {...this.props} />;
	}
	onDimChanged(dim) {
		this.props.setDim(dim);
	}
}

export default flow(
	connect(mapStateToProps, mapDispatchToProps),
	injectHammer()
)(BoardContainer);

function mapStateToProps(state, props) {
	return {
		headerVisibility: state.app.headerVisibility,
		board: state.board,
		list: state.list[props.params.id],
	};
}

function mapDispatchToProps(dispatch) {
	return {
		setDim: (dimArg) => dispatch(setDim(dimArg)),
		boardActions: bindActionCreators(BoardActions, dispatch),
		listActions: bindActionCreators(ListActions, dispatch),
		cardActions: bindActionCreators(CardActions, dispatch),
	};
}
