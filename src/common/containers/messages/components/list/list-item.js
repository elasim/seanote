import React, { Component, PropTypes } from 'react';
import { intlShape } from 'react-intl';
import browserHistory from 'react-router/lib/browserHistory';
import Avatar from 'material-ui/Avatar';
import FontIcon from 'material-ui/FontIcon';
import { ListItem } from 'material-ui/List';
import css from './list-item.scss';

export default class ChatListItem extends Component {
	static contextTypes = {
		intl: intlShape.isRequired,
	}
	static propTypes = {
		item: PropTypes.object,
	}
	componentWillMount() {
		this.onClick = ::this.onClick;
	}
	render() {
		const { intl } = this.context;
		const { item } = this.props;
		const props = {
			leftAvatar: <Avatar icon={<FontIcon className="material-icons">&#xE0B7;</FontIcon>} />,
			primaryText: (
				<div className={css.item}>
					<p className={css.who}>{item.users.join(', ')}</p>
					<p className={css.title}>{this.props.index}. {item.name}</p>
				</div>
			),
			secondaryTextLines: 2,
			secondaryText: (
				<div>
					Last Chat Message
					<div style={{textAlign:'right'}}>{intl.formatRelative(new Date('2016-07-18, 21:59:04'))}</div>
				</div>
			),
			onTouchTap: this.onClick,
		};
		return (<ListItem {...props} />);
	}
	onClick() {
		browserHistory.push(`/messages/${this.props.item.id}`);
	}
}
