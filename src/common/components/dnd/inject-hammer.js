import React from 'react';
import Container from './container';

export default (options) => WrappedComponent => (props) => (
	<Container {...options}>
		<WrappedComponent {...props}/>
	</Container>
);
