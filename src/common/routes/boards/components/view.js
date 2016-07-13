import cx from 'classnames';
import React, { Component, PropTypes } from 'react';
import Droppable from '../../../lib/dnd/droppable';
import { createResizeSpy, getViewportWidth } from '../../../lib/dom-helpers';

import css from '../styles/view.scss';

export default class View extends Component {
	static contextTypes = {
		setTitle: PropTypes.func.isRequired,
		hammer: PropTypes.object,
	}
	componentWillMount() {
		this.context.setTitle('Board Item View');
		this.state = {
			activeOverlay: false,
			frontOverlay: false,
		};
	}
	componentDidMount() {
		window.scrollTo(0, 1);
		this.resizeSpy = createResizeSpy(::this.adjustLayout, getViewportWidth);
		this.disposeDragHook = this.context.hammer.createHook(
			::this.prepareOverlay,
			null,
			::this.moveBackOverlay
		);
	}
	componentWillUnmount() {
		this.resizeSpy.dispose();
		this.disposeDragHook();
	}
	render() {
		const { activeOverlay, frontOverlay } = this.state;
		return (
			<Droppable
				onDragOver={::this.toogleOverlay}
				onDragOut={::this.toogleOverlay}
				onDrop={::this.toogleOverlay}
			>
				<div className={cx(css.root, {
					[css.full]: this.props.full
				})}>
					Board {this.props.id}
					Content
					<input />
					<div className={cx(css.overlay, {
						[css.front]: frontOverlay,
						[css.active]: activeOverlay
					})} />
				</div>
			</Droppable>
		);
	}

	prepareOverlay() {
		this.setState({
			frontOverlay: true,
		});
	}
	moveBackOverlay() {
		this.setState({
			frontOverlay: false
		});
	}
	toogleOverlay(e, descriptor) {
		const { data } = descriptor;
		if (data.id === this.props.id) {
			return;
		}
		this.setState({ activeOverlay: !this.state.activeOverlay });
	}
	adjustLayout() {

	}
}
