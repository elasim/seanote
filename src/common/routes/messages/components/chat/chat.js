import React from 'react';

export default function Chat(props) {
	const { style, className } = props;
	const rootClassName = className;
	return (
		<div className={rootClassName} style={style}>
		Chat
		</div>
	);
}
