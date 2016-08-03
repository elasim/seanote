import React, { PropTypes } from 'react';
import EditableContent from '../../../../components/editable-content';
import ComponentEx from '../../../component';

const debug = require('debug')('App.Components.CardContent');

class Note extends ComponentEx {
	static propTypes = {
		data: PropTypes.object,
	};
	componentWillMount() {
		this.onChanged = ::this.onChanged;
	}
	render() {
		return (
			<EditableContent
				value={this.props.data.text}
				onChanged={this.onChanged}
			/>
		);
	}
	onChanged(sender, value) {
		debug('Note change', value);
		this.sendMessage('change', {
			...this.props.data,
			text: value,
		});
	}
}

export default class CardContent extends ComponentEx {
	static propTypes = {
		data: PropTypes.object.isRequired,
	};
	render() {
		const { data } = this.props;
		const renderComponent = selectComponent(data.type);
		if (renderComponent) {
			return React.createElement(renderComponent, {
				...this.props,
			});
		} else {
			return <div>{data.type}</div>;
		}
	}
}

function selectComponent(type) {
	switch (type) {
		case 'note': return Note;
		default: null;
	}
}
