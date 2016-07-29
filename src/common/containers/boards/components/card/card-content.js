import React, { Component, PropTypes } from 'react';

function Note(props) {
	const { data } = props;
	return <span>{data.text}</span>;
}

export default class CardContent extends Component {
	static propTypes = {
		data: PropTypes.object.isRequired
	};
	render() {
		const { data } = this.props;

		switch (data.type) {
			case 'note': return <Note data={data} />;
			default:
				return <span>{data.type}</span>;
		}
	}
}
