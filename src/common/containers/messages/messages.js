import React, { Component, PropTypes } from 'react';
import { intlShape } from 'react-intl';
import List from './components/list';
import Chat from './components/chat';
import css from './messages.scss';

export default class Messages extends Component {
	static contextTypes = {
		intl: intlShape.isRequired,
	};
	componentWillMount() {
		this.state = {
			active: null
		};
	}
	render() {
		return (
			<div className={css.root}>
				<List
					className={css.list}
					onMessage={this.handleListEvent}
				/>
				<Chat
					className={css.chat}
					view={this.state.active}
					onMessage={this.handleViewEvent}
				/>
			</div>
		);
	}
	handleListEvent() {

	}
	handleViewEvent() {

	}
}
