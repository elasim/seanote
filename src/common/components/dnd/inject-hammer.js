import React from 'react';
import Container from './container';

export default (options) => (WrappedComponent) => {
	const HammerInjecter = (props) => (
		<Container {...options}>
			<WrappedComponent {...props}/>
		</Container>
	);
	HammerInjecter.WrappedComponent = WrappedComponent;

	return HammerInjecter;
};
