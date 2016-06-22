import cx from 'classnames';
import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';

import SortableList from '../../components/sortable-list';
import css from './style.scss';

export default class GridItemTemplate extends Component {
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
		const {
			className,
			style,
			...data,
		} = this.props;
		const { nameEditable } = this.state;
		return (
			<div className={cx(css.item, 'mdl-shadow--2dp', className)} style={style}>
				<div className={css['item-header']}
					ref="name"
					onClick={::this.toggleEditName}
					onBlur={::this.toggleEditName}
					contentEditable={nameEditable}
					dangerouslySetInnerHTML={{__html:data.name||' '}} />
				<SortableList items={data.items} allowIn allowOut />
			</div>
		);
	}
}
