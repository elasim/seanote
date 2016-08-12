import React, { Component, PropTypes } from 'react';
import connect from 'react-redux/lib/components/connect';
import { asyncConnect } from 'redux-connect';
import bindActionCreators from 'redux/lib/bindActionCreators';
import compose from 'recompose/compose';
import { createSelector } from 'reselect';
import injectHammer from '../../components/dnd/inject-hammer';
import { setDim } from '../../actions/app';
import BoardActions from '../../actions/board';
import ListActions from '../../actions/list';
import CardActions from '../../actions/card';
import Board from './components/boards';

const debug = require('debug')('App.Component.BoardContainer');

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

const getLists = (state, props) => state.list[props.params.id];
const getCards = (state) => state.card;

const selectLists = createSelector(
	getLists,
	lists => {
		if (!lists) return null;
		return lists.items;
	});

const selectCards = createSelector(
	[selectLists, getCards],
	(lists, cards) => {
		if (!lists || lists.length === 0) return null;
		return Object.assign(...lists.map(list => {
			return {
				[list.id]: cards[list.id].items
			};
		}));
	});

function mapStateToProps(state, props) {
	return {
		headerVisibility: state.app.headerVisibility,
		board: state.board,
		lists: selectLists(state, props),
		cards: selectCards(state, props),
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

export default compose(
	asyncConnect([
		{
			key: 'Board.ViewData',
			promise: async (params)  => {
				if (params.params.id) {
					const command = ListActions.load(params.params.id);
					const { getState, dispatch } = params.store;
					debug('Run Action');
					await command(dispatch, getState);
				}
			}
		},
	]),
	connect(mapStateToProps, mapDispatchToProps),
	injectHammer(),
)(BoardContainer);
