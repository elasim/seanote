import cx from 'classnames';
import React, { Component, PropTypes } from 'react';
import css from './grid-item.scss';

export default class GridItem extends Component {
	static propTypes = {
		id: PropTypes.string.isRequired,
		className: PropTypes.string,
		style: PropTypes.object,
	};
	render() {
		const { className, style } = this.props;
		const rootClassName = cx(css.item, className);
		return (
			<div className={rootClassName} style={style}>
				{this.props.children}
			</div>
		);
	}
}
