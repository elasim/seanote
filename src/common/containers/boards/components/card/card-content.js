import Rx from 'rx';
import React, { PropTypes } from 'react';
import ComponentEx from '../../../component';
import { findDOMNode } from 'react-dom';

class Note extends ComponentEx {
	static propTypes = {
		data: PropTypes.object,
	};
	componentWillMount() {
		this.state = {
			editable: false
		};
		this.onClick = ::this.onClick;
		this.onBlur = ::this.onBlur;
	}
	componentDidUpdate() {
		if (this.state.editable) {
			findDOMNode(this).focus();
		}
	}
	render() {
		const { data } = this.props;
		const { editable } = this.state;
		return (
			<div onClick={this.onClick} onBlur={this.onBlur}
				contentEditable={editable}
				dangerouslySetInnerHTML={{__html:data.text}}>
			</div>
		);
	}
	onClick() {
		this.beginChange();
	}
	onBlur() {
		this.endChange();
	}
	beginChange() {
		const element = findDOMNode(this);
		this.keyDown = Rx.Observable.fromEvent(element, 'keydown')
			.subscribe(event => {
				if (event.keyCode === 13) {
					this.endChange();
				}
			});
		this.setState({
			editable: true,
		});
	}
	endChange() {
		this.keyDown.dispose();
		delete this.keyDown;

		const { data } = this.props;
		const newText = findDOMNode(this).textContent;
		if (data.text !== newText) {
			this.sendMessage('change', {
				...data,
				text: newText
			});
		}
		this.setState({
			editable: false
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
