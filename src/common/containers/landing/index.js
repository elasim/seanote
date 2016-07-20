import cx from 'classnames';
import React, { Component } from 'react';
import withContext from '../with-context';
import { createScrollSpy } from '../../lib/dom-helpers';
import Header from './header';

import css from './landing.scss';

@withContext
export default class Landing extends Component {
	constructor(...args) {
		super(...args);
		this.state = { shrink: false };
		this.adjustLayout = ::this.adjustLayout;
	}
	componentDidMount() {
		this.adjustLayout();
		this.scrollSpy = createScrollSpy(this.adjustLayout);
	}
	componentWillUnmount() {
		this.scrollSpy.dispose();
	}
	render() {
		return (
			<div className={cx(css.root, {[css.shrink]: this.state.shrink})}>
				<Header shrink={this.state.shrink} />
				<div className={css.container}>
					{this.props.children}
				</div>
			</div>
		);
	}
	adjustLayout() {
		const nextState = document.body.scrollTop > 0;
		if (this.state.shrink !== nextState) {
			this.setState({
				shrink: nextState
			});
		}
	}
}
