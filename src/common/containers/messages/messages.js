import Rx from 'rx';
import cx from 'classnames';
import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';
import { intlShape } from 'react-intl';
import Chat from './components/chat';
import List from './components/list';
import {
	createScrollSpy,
	getViewportWidth,
	getViewportHeight,
} from '../../lib/dom-helpers';
import css from './messages.scss';

const testdata = [
	// room info info
	{
		id: 1,
		name: 'Test Chat Room 1',
		users: [
			'admin',
			'tester1',
			'test2'
		],
	},
	{
		id: 2,
		name: 'Test Chat Room 2',
		users: [
			'admin',
			'test2',
		],
	},
	{
		id: 3,
		name: 'Supports',
		users: [
			'tester1',
			'seanote-supports',
		],
	},
]
	.reduce((agg, cur) => agg.concat(cur,cur,cur), [])
	.reduce((agg, cur) => agg.concat(cur,cur,cur), [])
	.reduce((agg, cur) => agg.concat(cur,cur,cur), []);

@connect(state => {
	return {
		headerVisibility: state.app.headerVisibility,
	};
})
export default class Messages extends Component {
	static contextTypes = {
		intl: intlShape.isRequired,
	};
	componentWillMount() {
		this.state = {
			active: null,
			items: testdata,
			limit: 10,
		};
	}
	componentDidMount() {
		this.bodyScrollSpy = createScrollSpy(() => {
			const width = getViewportWidth();
			if (width > 960 || this.props.params.id) return;

			const scrollBottom = document.body.scrollTop + getViewportHeight();
			if (scrollBottom >= document.body.scrollHeight) {
				this.loadMore();
			}
		});
		this.listScrollSpy = createScrollSpy(() => {
			const listElement = findDOMNode(this.refs.list);
			const scrollBottom = listElement.scrollTop + listElement.clientHeight;
			if (scrollBottom >= listElement.scrollHeight) {
				this.loadMore();
			}
		}, findDOMNode(this.refs.list));
	}
	componentWillUnmount() {
		this.listScrollSpy.dispose();
		this.bodyScrollSpy.dispose();
	}
	render() {
		const items = this.state.items.slice(0, this.state.limit);

		const rootClassName = cx(css.root, {
			[css['content']]: !!this.props.params.id,
			[css['no-header']]: !this.props.headerVisibility,
		});
		let chat;
		if (this.props.params.id) {
			chat = (
				<Chat
					className={css.chat}
					view={this.state.active}
					onMessage={this.handleViewEvent}
				/>
			);
		} else {
			chat = (
				<div>Select or Start new Chat</div>
			);
		}
		return (
			<div className={rootClassName}>
				<div className={css.list} ref="list">
					<List items={items} />
				</div>
				{chat}
			</div>
		);
	}
	loadMore() {
		const { items, limit } = this.state;
		if (items.length > limit) {
			this.setState({
				limit: this.state.limit + 10,
			});
		} else {
			console.log('No more');
		}
	}
}
