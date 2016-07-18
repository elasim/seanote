import React, { Component } from 'react';
import { intlShape } from 'react-intl';
import Link from 'react-router/lib/Link';
import FlatButton from 'material-ui/FlatButton';
import { Card, CardHeader, CardText, CardActions } from 'material-ui/Card';
import css from './groups.scss';

export default class Groups extends Component {
	static contextTypes = {
		intl: intlShape.isRequired,
	};
	componentWillMount() {
		this.DEMO = [
			{
				id: 0,
				name: 'Hello World',
				peoples: 777,
				isPublic: true
			},
			{
				id: 1,
				name: 'Seanote Developers',
				peoples: 7,
				isPublic: false,
			},
			{
				id: 2,
				name: 'Seanote Testers',
				peoples: 4000,
				isPublic: true,
			},
			{
				id: 3,
				name: 'Bug Bursters',
				peoples: 0,
				isPublic: false,
			},
		];
	}
	componentDidMount() {
		window.scrollTo(0, 1);
	}
	render() {
		const { intl } = this.context;
		const groups = this.DEMO
			.reduce((agg, cur) => agg.concat(cur, cur), [])
			.sort((lhs, rhs) => lhs.peoples < rhs.peoples)
			.map((group, index) => {
				const locked = group.isPublic ? null : (
					<i className="material-icons">&#xE897;</i>
				);
				return (
					<li key={index}>
						<Card>
							<CardHeader title={group.name}
								subtitle={`Member ${intl.formatNumber(group.peoples)}`}
							/>
							<CardActions>
								<Link to={`/groups/${group.id}`}>
									<FlatButton label="Go" backgroundColor="#90A4AE" />
								</Link>
								<FlatButton label="Join" backgroundColor="#B0BEC5" />
							</CardActions>
						</Card>
					</li>
				);
			});
		return (
			<div className={css.root}>
				<ul className={css.list}>{groups}</ul>
			</div>
		);
	}
}
