import cx from 'classnames';
import React, { Component, PropTypes } from 'react';
import Droppable from '../../../lib/dnd/droppable';
import { createResizeSpy, getViewportWidth } from '../../../lib/dom-helpers';
import { CardList } from './card-list';
import css from '../styles/view.scss';

export default class View extends Component {
	static contextTypes = {
		setTitle: PropTypes.func.isRequired,
		hammer: PropTypes.object,
	}
	static propTypes = {
		id: PropTypes.string,
		actions: PropTypes.object,
		full: PropTypes.bool,
	}
	componentWillMount() {
		this.context.setTitle('Board Item View');
		this.state = {
			activeOverlay: false,
			frontOverlay: false,
		};
		this.toggleOverlay = ::this.toggleOverlay;
	}
	componentWillReceiveProps(nextProps) {
		if (this.props.id !== nextProps.id) {
			this.loadListData(nextProps.id);
			if (typeof window !== 'undefined') {
				window.scrollTo(0, 1);
			}
		}
	}
	componentDidMount() {
		window.scrollTo(0, 1);
		this.resizeSpy = createResizeSpy(::this.adjustLayout, getViewportWidth);
		this.disposeDragHook = this.context.hammer.createHook(
			::this.prepareOverlay,
			null,
			::this.moveBackOverlay
		);
		this.loadListData(this.props.id);
		
	}
	componentWillUnmount() {
		this.resizeSpy.dispose();
		this.disposeDragHook();
	}
	loadListData(id) {
		if (!id) {
			return;
		}
		const { actions: { load } } = this.props;
		return load(id);
	}
	render() {
		const { activeOverlay, frontOverlay } = this.state;
		const dropEvents = {
			onDragOver: this.toggleOverlay,
			onDragOut: this.toggleOverlay,
			onDrop: this.toggleOverlay,
		};
		const rootClassName = cx(css.root, {
			[css.full]: this.props.full
		});
		const overlayClassName = cx(css.overlay, {
			[css.front]: frontOverlay,
			[css.active]: activeOverlay
		});

		return (
			<Droppable {...dropEvents}>
				<div className={rootClassName}>
					<CardList
						items={this.props.data}
						onMessage={this.handleListEvent}
					/>
					<div className={overlayClassName} />
				</div>
			</Droppable>
		);
	}
	handleListEvent(type, arg) {
		switch (type) {
			case CardList.EventTypes.DragOver: {
				const [descriptor, drop] = arg;
				this.props.actions.sort(descriptor.data.id, drop.id);
				return;
			}
		}
	}
	prepareOverlay(e) {
		if (e.descriptor.type !== 'board') return;
		this.setState({
			frontOverlay: true,
		});
	}
	moveBackOverlay() {
		if (this.state.frontOverlay) {
			this.setState({
				frontOverlay: false
			});
		}
	}
	toggleOverlay(e, descriptor) {
		const { data } = descriptor;
		if (data.id === this.props.id || !this.state.frontOverlay) {
			return;
		}
		this.setState({ activeOverlay: !this.state.activeOverlay });
	}
	adjustLayout() {

	}
}
