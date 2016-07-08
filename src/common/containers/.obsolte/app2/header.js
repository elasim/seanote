import cx from 'classnames';
import React, { Component, PropTypes } from 'react';

export default class Header extends Component {
	static propTypes = {
		seamed: PropTypes.bool,
		title: PropTypes.any,
	};
	render() {
		const {
			seamed,
			title,
			children,
			className,
			style,
			contextIcon,
			contextAction,
		} = this.props;
		const classes = cx('mdl-layout__header', {
			'mdl-layout__header--seamed': seamed
		}, className);
		const contextMenuButtonState = cx('mdl-layout__drawer-button', {
			'hide': !!contextAction
		});
		let contextActionButton = null;
		if (contextAction) {
			contextActionButton = (
				<div className="mdl-layout__drawer-button"
					onClick={contextAction}>
					<i className="material-icons">{contextIcon||'dehaze'}</i>
				</div>
			);
		}
		return (
			<div className={classes} style={style}>
				<div className={contextMenuButtonState}>
					<i className="material-icons">{contextIcon||'dehaze'}</i>
				</div>
				{contextActionButton}
				<div className="mdl-layout__header-row">
					<span className="mdl-layout-title">
						{title}
					</span>
					<div className="mdl-layout-spacer" />
					{children}
				</div>
			</div>
		);
	}
}
