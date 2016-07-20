import Rx from 'rx';
import cx from 'classnames';
import Prefixer from 'inline-style-prefixer';
import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import Avatar from 'material-ui/Avatar';
import { Card, CardHeader, CardText, CardActions } from 'material-ui/Card';
import { getViewportWidth } from '../../lib/dom-helpers';
import css from './dashboard.scss';

export default class BoardDashboard extends Component {
	static contextTypes = {
		setTitle: PropTypes.func.isRequired,
	}
	componentWillMount() {
		this.context.setTitle('Overview');
		this.state = {
			data: null,
			ghosts: [],
			positions: [],
			columns: 0,
			items: Array.apply(null, { length: 20 }).map(() => {
				return Math.floor(Math.random() * 1000) % 80 + 80;
			})
		};
		this.dirty = false;
	}
	componentDidMount() {
		this.stylePrefixer = new Prefixer({
			userAgent: navigator.userAgent
		});
		this.resizeSpy = Rx.Observable.fromEvent(window, 'resize')
			.debounce(200)
			.map(() => getViewportWidth())
			.distinctUntilChanged()
			.subscribe(() => {
				this.setState({ positions: [] });
				this.updateGhostElements();
			});
		this.updateGhostElements();
	}
	componentDidUpdate() {
		if (this.dirty) {
			this.updatePositions();
		}
	}
	componentWillUnmount() {
		this.resizeSpy.dispose();
	}
	render() {
		const items = this.state.items
			.map((height, index) => {
				let position = this.state.positions[index];
				return (
					<div className={css.topic}
						key={index}
						ref={`item-${index}`}
						style={position}>
						<Card style={{height}}>
							<CardHeader title="Primary Title"
								avatar={<Avatar>B</Avatar>}/>
						</Card>
					</div>
				);
			});

		let ghosts;
		if (this.state.columns > 0 && this.state.ghosts.length > 0) {
			const cols = [];
			for (let i = 0; i < this.state.columns; ++i) {
				cols[i] = [];
			}
			this.state.ghosts.forEach((ghost, index) => {
				cols[index % this.state.columns].push(
					<div ref={`ghost-${index}`} key={index}
						className={cx(css.topic, css.ghost)}
						style={{ height: ghost.height }}
					/>
				);
			});
			ghosts = cols.map((nodes, index) => {
				return (
					<div className={cx(css.topic, css.ghost, css.col)} key={`ghost-col-${index}`}>
						{nodes}
					</div>
				);
			});
		}
		return (
			<div className={css.root}>
				{items}
				{ghosts}
			</div>
		);
	}
	updatePositions() {
		if (!this.dirty) return;
		
		const container = findDOMNode(this).getBoundingClientRect();
		const positions = this.state.items
			.map((item, index) => {
				const node = findDOMNode(this.refs[`ghost-${index}`]);
				const box = node.getBoundingClientRect();
				const offsetX = Math.floor(index % this.state.columns) * 5;
				const offsetY = Math.floor(index / this.state.columns) * 0;
				const x = box.left + offsetX - container.left;
				const y = box.top + offsetY - container.top;
				const transform = `translate3d(${x}px, ${y}px, 0)`;
				return this.stylePrefixer.prefix({
					transform,
					width: box.width,
					height: box.height,
				});
			});
		this.setState({
			positions
		});
		this.dirty = false;
	}
	updateGhostElements() {
		let columns = 0;
		const ghosts = Object.keys(this.refs)
			.filter(refId => /^item-/.test(refId))
			.map(refId => {
				const element = findDOMNode(this.refs[refId]);
				const box = element.getBoundingClientRect();
				return { ref: refId, width: box.width, height: box.height };
			});
		const containerWidth = findDOMNode(this).getBoundingClientRect().width;
		if (ghosts.length > 0) {
			columns = Math.max(1, Math.floor(containerWidth / ghosts[0].width));
		}
		this.dirty = true;
		this.setState({
			ghosts,
			columns,
		});
	}
}
