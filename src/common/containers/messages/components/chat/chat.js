import cx from 'classnames';
import React, { Component } from 'react';
import { intlShape } from 'react-intl';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import SendIcon from 'material-ui/svg-icons/content/send';
import InsertEmoticonIcon from 'material-ui/svg-icons/editor/insert-emoticon';
import ShareIcon from 'material-ui/svg-icons/social/share';
import PersonAddIcon from 'material-ui/svg-icons/social/person-add';
import css from './chat.scss';

export default class Chat extends Component {
	static contextTypes = {
		intl: intlShape.isRequired,
	};
	componentDidMount() {
		window.scrollTo(0, document.body.scrollHeight);
	}
	render() {
		const { intl } = this.context;
		const { style, className } = this.props;

		const rootClassName = cx(css.root, className);
		return (
			<div className={rootClassName} style={style}>
				<ol>
					<li>
						<div>{intl.formatRelative(Date.now())}</div>
						<p>admin</p>
						<p>Hi!</p>
					</li>
					<li>
						<p>2016.07.19</p>
					</li>
					<li>
						<div>{intl.formatRelative(Date.now())}</div>
						<p>test1</p>
						<p>This is Chat Sample</p>
					</li>
				</ol>
				<div className={css.form}>
					<div className={css.row}>
						<TextField
							hintText="Message Field"
							fullWidth={true}
							multiLine={true}
							rows={1} />
					</div>
					<div>
						<IconButton><InsertEmoticonIcon/></IconButton>
						<IconButton><ShareIcon/></IconButton>
						<IconButton><PersonAddIcon/></IconButton>
						<IconButton style={{float:'right'}}><SendIcon/></IconButton>
					</div>
				</div>
			</div>
		);
	}
}
