import Rx from 'rx';
import cx from 'classnames';
import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import css from './style.css';

export default class CascadeGrid extends Component {
	static propTypes = {
		items: PropTypes.arrayOf(PropTypes.object).isRequired,
		keyName: PropTypes.string.isRequired,
		columnWidth: PropTypes.number,
		columnKey: PropTypes.string,
		columnTemplate: PropTypes.func,
		itemKey: PropTypes.string,
		itemTemplate: PropTypes.func,
	};
	static defaultProps = {
		columnWidth: 200,
		columnKey: 'cascade-grid-column-',
		columnTemplate: (props) => {
			return (
				<div style={props.style}
					className={props.className} >
					{props.children}
				</div>
			);
		},
		itemKey: 'cascade-grid-item-',
		itemTemplate: (props) => {
			return (
				<div className={props.className}>{JSON.stringify(props)}</div>
			);
		},
	};
	constructor(props, context) {
		super(props, context);
		this.state = {
			columns: 1,
		};
	}
	render() {
		const {
			items,
			keyName,
			itemKey,
			itemTemplate,
			columnKey,
			columnWidth,
			columnTemplate,
			className,
			...unknownProps,
		} = this.props;
		const numCols = this.state.columns;
		const columns = new Array();
		const columnStyle = {};
		const alignStyle = {};

		for (let i = 0; i < numCols; ++i) {
			columns.push([]);
		}
		
		items.forEach((item, i) => {
			columns[i % numCols].push(
				React.createElement(itemTemplate, {
					...item,
					key: itemKey + (item[keyName] || i),
					className: css.item,
					index: i,
				})
			);
		});

		if (numCols > 1) {
			columnStyle.width = columnWidth;
			alignStyle.width = columnWidth * numCols;
		}
		return (
			<div {...unknownProps} className={cx(css.root, className)}>
				<div style={alignStyle} className={css.align}>
				{
					columns.map((col, i) => (
						React.createElement(columnTemplate, {
							key: columnKey + i,
							style: columnStyle,
							className: css.col,
						}, col)
					))
				}
				</div>
				{this.props.children}
			</div>
		);
	}
	componentDidMount() {
		this._adjustingLayout = Rx.Observable.fromEvent(window, 'resize')
			.debounce(100)
			.subscribe(::this.adjustLayout);
		this.adjustLayout();
	}
	componentWillUnmount() {
		this._adjustingLayout.dispose();
	}
	adjustLayout() {
		const { columnWidth } = this.props;
		const dom = findDOMNode(this);
		const rect = dom.getBoundingClientRect();
		const columns = Math.max(Math.floor(rect.width / columnWidth), 1);
		this.setState({
			columns
		});
	}
}
