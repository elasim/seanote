import React, { PropTypes } from 'react';
import css from './dim.scss';

export default function Dim(props) {
	const { active, onClick } = props;
	if (!active) return null;
	return (
		<div className={css.root} onClick={onClick}>
		</div>
	);
}

Dim.propTypes = {
	active: PropTypes.bool,
	onClick: PropTypes.func,
};
