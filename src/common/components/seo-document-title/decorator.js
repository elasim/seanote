import React, { Component } from 'react';
import { connect } from 'react-redux';

export default function SEODocumentTitle(title) {
	return Composed => (
		@connect(null, dispatch => ({
			setTitle: () => dispatch({ type: 'setTitle', payload: title })
		}))
		class SEODocumentTitle extends Component {
			componentWillMount() {
				this.props.setTitle();
			}
			render() {
				return <Composed {...this.props} />;
			}
		}
	);
}
