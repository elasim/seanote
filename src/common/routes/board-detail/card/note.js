import React, { Component, PropTypes } from 'react';
import EditableDiv from '../editable-div';

export default class NoteCard extends Component {
	static propTypes = {
		value: PropTypes.object.isRequired,
		onCardChange: PropTypes.func.isRequired,
	};
	render() {
		return (
			<EditableDiv defaultValue={this.props.value.detail.text}
				onChange={::this.onChange}
			/>
		);
	}
	onChange(text) {
		const { value } = this.props;
		this.props.onCardChange(value.id, {
			...value.detail,
			text,
		});
	}
}
