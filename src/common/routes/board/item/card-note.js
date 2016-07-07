import React, { Component, PropTypes } from 'react';

import css from './style.scss';

export default class NoteItem extends Component {
	static propTypes = {
		data: PropTypes.shape({
			type: PropTypes.string,
			detail: PropTypes.object,
		}).isRequired
	};
	render() {
		const { data } = this.props;
		return (
			<div className={css.body}>
				{data.detail.text}
			</div>
		);
	}
}
