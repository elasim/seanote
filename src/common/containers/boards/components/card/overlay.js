import cx from 'classnames';
import React from 'react';
import css from './overlay.scss';

export default function Overlay(props) {
	const overlayClassName = cx(css.overlay, {
		[css.active]: props.active,
	});
	return (
		<div className={overlayClassName}>
			<i className="material-icons">&#xE154;</i>
			<div className={css.background} />
		</div>
	);
}
