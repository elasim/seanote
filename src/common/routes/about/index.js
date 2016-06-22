import React, { Component, PropTypes } from 'react';
//import { connect } from 'react-redux';
import SEODocumentTitle from '../../components/seo-document-title/decorator';

@SEODocumentTitle('About')
export default class AboutView extends Component {
	render() {
		return (
			<div className="mdl-layout__content">ABOUT</div>
		);
	}
}
