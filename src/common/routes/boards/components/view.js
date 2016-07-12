import cx from 'classnames';
import React, { Component, PropTypes } from 'react';
import Droppable from '../../../lib/dnd/droppable';
import { createResizeSpy, getViewportWidth } from '../../../lib/dom-helpers';

import css from '../styles/view.scss';

export default class View extends Component {
	static contextTypes = {
		setTitle: PropTypes.func.isRequired,
	}
	componentWillMount() {
		this.context.setTitle('Board Item View');
		this.state = {
			activeOverlay: false
		};
	}
	componentDidMount() {
		window.scrollTo(0, 1);
		this.resizeSpy = createResizeSpy(this::adjustLayout, getViewportWidth);
	}
	componentWillUnmount() {
		this.resizeSpy.dispose();
	}
	render() {
		const { activeOverlay } = this.state;
		return (
			<Droppable
				onDragOver={this::toogleOverlay}
				onDragOut={this::toogleOverlay}
				onDrop={this::toogleOverlay}
			>
				<div className={cx(css.root, {
					[css.full]: this.props.full
				})}>
					Board {this.props.params.id}
					Content
					<input />
					<div className={cx(css.overlay, {
						[css.active]: activeOverlay
					})} />
				</div>
			</Droppable>
		);
	}
}

function toogleOverlay() {
	this.setState({ activeOverlay: !this.state.activeOverlay });
}

function adjustLayout() {

}