import cx from 'classnames';
import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import diffWith from 'lodash/differenceWith';
import css from '../styles/card-list.scss';

export class CardItem extends Component {
	render() {
		const { data, type } = this.props;
		const items = data.Cards.map(card => {
			return (
				<li>
					{type}
					{JSON.stringify(card)}
				</li>
			);
		});
		return (
			<div className={css.item}>
				<div>{data.name}</div>
				<ol>
				{items}
				</ol>
			</div>
		);
	}
}

export class CardList extends Component {
	static propTypes = {
		items: PropTypes.array,
	};
	componentWillMount() {
		this.state = {
			ready: false,
			positions: [],
		};
	}
	componentWillReceiveProps(nextProps) {
		const diff = diffWith(nextProps.items, this.props.items);
		if (diff.length > 0) {
			console.log('Make diff');
			this.setState({
				positions: this.makePositions(nextProps.items)
			});
		}
	}
	componentDidMount() {
		// find component width and arrange items
		const { items } = this.props;
		const state = {
			ready: true,
			positions: this.makePositions(items)
		};
		this.setState(state);
	}
	render() {
		const { className, items } = this.props;
		const { ready, width } = this.state;
		let cards;
		if (items) {
			let style;
			if (ready && width) {
				style = { width };
			}
			cards = items.map(item => {
				const { id, type, ...data } = item;
				return <CardItem ref={id} key={id} type={type} data={data} />;
			});
		}
		const rootClassName = cx(css.root, className, {
			[css.ready]: ready
		});
		return <div className={rootClassName}>{cards}</div>;
	}
	makePositions(items) {
		if (!items) return [];
		const element = findDOMNode(this);
		// figure out height and width of grids
	}
}
