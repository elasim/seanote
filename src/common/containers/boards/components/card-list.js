import cx from 'classnames';
import React, { Component, PropTypes } from 'react';
import { Card, CardHeader, CardText, CardActions } from 'material-ui/Card';
import { Grid, GridItem } from '../../../components/grid';
import Draggable from '../../../lib/dnd/draggable';
import Droppable from '../../../lib/dnd/droppable';
import css from '../styles/card-list.scss';

function ListPreview(props) {
	return (
		<div style={props.style} className={props.className}>
			{'ListPreview'}
		</div>
	);
}

const listStyle = {listStyle:'none', margin: 0, padding: 0};
export class CardItem extends Component {
	render() {
		const { data, type } = this.props;
		const items = data.Cards.map(card => {
			return (
				<li key={card.id}>
					{card.id}
				</li>
			);
		});
		return (
			<Droppable>
				<Draggable data={data} type="list" preview={<ListPreview />} >
					<Card className={this.props.className} style={this.props.style}>
						<CardHeader title={data.name}/>
						<CardText>
							<ol style={listStyle}>
								{items}
							</ol>
						</CardText>
					</Card>
				</Draggable>
			</Droppable>
		);
	}
}

export class CardList extends Component {
	static propTypes = {
		items: PropTypes.array,
	};
	// componentWillMount() {
	// 	this.onDragOver = ::this.onDragOver;
	// }
	render() {
		const { className } = this.props;

		const rootClassName = cx(css.root, className);
		const items = this.props.items ? this.props.items.map(item => (
			<GridItem key={item.id} id={item.id} className={css.topic}>
				<CardItem data={item}/>
			</GridItem>
		)) : null;
	
		return (
			<Grid className={rootClassName} columnClassName={css.topic}>
				{items}
			</Grid>
		);
	}
}
