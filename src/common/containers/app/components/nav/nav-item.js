import cx from 'classnames';
import React, { PropTypes } from 'react';
import Link from 'react-router/lib/Link';
import FlatButton from 'material-ui/FlatButton';
import pure from 'recompose/pure';
import css from './nav-item.scss';

function NavItem(props) {
	const {
		label,
		icon,
		narrow,
		className,
		style,
		link,
	} = props;
	const commonProps = {
		labelStyle: {color: '#fff'},
	};
	return (
		<div className={cx(css.root, className)} style={style}>
			<Link to={link}>
				<FlatButton
					{...commonProps}
					icon={icon}
					label={!narrow ? label : null}
					style={{
						width: '100%',
						height: 50,
						textAlign: !narrow ? 'left' : 'center',
					}} />
			</Link>
			<div style={{
				display: narrow ? 'none' : 'block'
			}}>
			</div>
		</div>
	);
}

NavItem.propTypes = {
	className: PropTypes.string,
	style: PropTypes.object,
	narrow: PropTypes.bool,
	icon: PropTypes.element,
	label: PropTypes.string,
	link: PropTypes.string,
	items: PropTypes.array,
};

export default pure(NavItem);
