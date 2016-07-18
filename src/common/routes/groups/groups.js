import React, { Component } from 'react';
import Link from 'react-router/lib/Link';
import { intlShape } from 'react-intl';
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
						<Link to={`/groups/${group.id}`}>
							<h3>{locked}{group.name}</h3>
							<p>Member {intl.formatNumber(group.peoples)}</p>
						</Link>
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
