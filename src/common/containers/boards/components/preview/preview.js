import React from 'react';
import css from './preview.scss';

export default function ItemPreview(props) {
	const { width, height, style, className} = props;
	const boxStyle = Object.assign({
		width,
		height,
	});
	return (
		<div className={className} style={style}>
			<div className={css.root} style={boxStyle} />
		</div>
	);
}
