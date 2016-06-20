import React, { Component, PropTypes } from 'react';

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
			<div className="body">
				{data.detail.text}
			</div>
		);
	}
}
