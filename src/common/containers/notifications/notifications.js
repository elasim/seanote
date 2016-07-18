import React, { Component, PropTypes, } from 'react';
import { intlShape } from 'react-intl';
import Avatar from 'material-ui/Avatar';
import { Card, CardHeader, CardActions, CardText } from 'material-ui/Card';
import css from './notifications.scss';

export default class Notifications extends Component {
	static contextTypes = {
		intl: intlShape.isRequired,
		setTitle: PropTypes.func,
	};
	componentWillMount() {
		this.context.setTitle('Notifications');
	}
	render() {
		const { intl } = this.context;
		const testData = [
			{
				type: 'datetime',
				from: 'board-id/list-id/card-id',
			},
			{
				type: 'follower',
				who: 'seanote-support'
			},
		];
		const items = testData.map(item => {
			return (
				<Card>
					<CardHeader
						title="Notification Sample"
						subtitle="h?"
						avatar={<Avatar>T</Avatar>}
					>
						<div style={{float: 'right'}}>
							{intl.formatRelative(new Date('2016-07-18'))}
						</div>
					</CardHeader>
					<CardText>
						Text
					</CardText>
				</Card>
			);
		});
		return (
			<div className={css.root}>
				{items}
			</div>
		);
	}
}
