import React, { Component } from 'react';
import { intlShape } from 'react-intl';
import { List } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import isEqual from 'lodash/isEqual';
import ListItem from './list-item';

export default class ListView extends Component {
	static contextTypes = {
		intl: intlShape.isRequired,
	};
	shouldComponentUpdate(nextProps) {
		return !isEqual(nextProps, this.props);
	}
	render() {
		const { className, style, items } = this.props;
		const listItems = items.map((item, index) => {
			return [
				<ListItem key={index * 2 - 1} item={item} index={index} />,
				<Divider key={index * 2} />
			];
		});
		return (
			<List className={className} style={style}>
				{listItems}
			</List>
		);
	}
}
