import cx from 'classnames';
import React, { Component, PropTypes } from 'react';
import Link from 'react-router/lib/Link';
import IconButton from 'material-ui/IconButton';
import pure from 'recompose/pure';
import css from './header.scss';

class Header extends Component {
	static propTypes = {
		onClickMenu: PropTypes.func.isRequired,
		className: PropTypes.string,
	}
	constructor(...args) {
		super(...args);
	}
	componentWillMount() {
		this.state = {
			shrinkSearchbar: false,
			query: '',
		};
	}
	render() {
		const { className, onClickMenu } = this.props;

		return (
			<header className={cx(css.root, className, {
				[css['shrink-search']]: this.state.shrinkSearchbar,
			})}>
				<IconButton iconClassName="material-icons"
					disableTouchRipple={true}
					style={{ left: 5, top: -5 }}
					iconStyle={{ color: '#fff' }}
					onClick={onClickMenu}>
					&#xE3C7;
				</IconButton>
				<h1><Link to="/">Seanote</Link></h1>
				<form className={css.searchbar}>
					<i className={cx('material-icons', css.icon)}
						style={{left: 8}}>&#xE8B6;</i>
					<input type="text" ref="query"
						placeholder="Search"
						className={css.query}
						onBlur={this::expandSearchbar}
						onFocus={this::shrinkSearchbar}
						defaultValue={this.state.query}
						onChange={this::changeQueryValue} />
				</form>
			</header>
		);
	}
}

function changeQueryValue(e) {
	this.setState({ query: e.target.value });
}

function expandSearchbar() {
	this.setState({ shrinkSearchbar: false });
}

function shrinkSearchbar() {
	this.setState({ shrinkSearchbar: true });
}

export default pure(Header);
