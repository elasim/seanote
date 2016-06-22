import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';
import BoardItemList from '../../components/board';
// import Board from '../../models/board';
import css from './style.scss';

@connect(null, (dispatch) => ({
	update: (data) => dispatch({
		type: 'updateBoardItem',
		payload: data
	})
}))
export default class BoardItem extends Component {
	static propTypes = {
		data: PropTypes.object.isRequired,
	};
	constructor(props, context) {
		super(props, context);
		this.state = {
			nameEditable: false,
		};
	}
	toggleEditName() {
		this.setState({
			nameEditable: !this.state.nameEditable
		});
		setTimeout(findDOMNode(this.refs.name)::focus, 0);
	}
	render() {
		const { className, style, data, onPreviewChanged } = this.props;
		const { nameEditable } = this.state;
		return (
			<div className={className} style={style}>
				<div className={css['item-header']}
					ref="name"
					onClick={::this.toggleEditName}
					onBlur={::this.toggleEditName}
					contentEditable={nameEditable}
					dangerouslySetInnerHTML={{__html:data.name||'&nbsp;'}} />
				<BoardItemList items={data.items}
					notifyPreviewChanged={onPreviewChanged} />
			</div>
		);
	}
}
