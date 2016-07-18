import cx from 'classnames';
import React, { Component, PropTypes } from 'react';
import Link from 'react-router/lib/Link';
import IconButton from 'material-ui/IconButton';
import pure from 'recompose/pure';
import css from '../styles/header.scss';
import Symbol from '../../../lib/symbol-debug';

const EventTypes = {
	leftButtonClick: Symbol('app.header.leftButtonClick'),
};

@pure
class Header extends Component {
	static propTypes = {
		className: PropTypes.string,
		onMessage: PropTypes.func,
	}
	constructor(...args) {
		super(...args);
	}
	componentWillMount() {
		this.state = {
			shrinkSearchbar: false,
			query: '',
		};
		this.onClickLeftButton = this::onClickLeftButton;
		this.changeQueryValue = this::changeQueryValue;
		this.expandSearchbar = this::expandSearchbar;
		this.shrinkSearchbar = this::shrinkSearchbar;
	}
	render() {
		const { className } = this.props;
		return (
			<header className={cx(css.root, className, {
				[css['shrink-search']]: this.state.shrinkSearchbar,
			})}>
				<IconButton iconClassName="material-icons"
					disableTouchRipple={true}
					style={{ left: 5, top: -5 }}
					iconStyle={{ color: '#fff' }}
					onClick={this.onClickLeftButton}>
					&#xE3C7;
				</IconButton>
				<h1><Link to="/">Seanote</Link></h1>
				<form className={css.searchbar}>
					<i className={cx('material-icons', css.icon)}
						style={{left: 8}}>&#xE8B6;</i>
					<input type="text" ref="query"
						placeholder="Search"
						className={css.query}
						onBlur={this.expandSearchbar}
						onFocus={this.shrinkSearchbar}
						defaultValue={this.state.query}
						onChange={this.changeQueryValue} />
				</form>
			</header>
		);
	}
}

function onClickLeftButton() {
	this.props.onMessage(EventTypes.leftButtonClick);
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

Header.EventTypes = EventTypes;

export default Header;
