import cx from 'classnames';
import React, { Component, PropTypes } from 'react';
import FAButton from 'material-ui/FloatingActionButton';
import ContentAddIcon from 'material-ui/svg-icons/content/add';
import ContentCopyIcon from 'material-ui/svg-icons/content/content-copy';
import Droppable from '../../../lib/dnd/droppable';
import Dim from './dim';
import css from '../styles/fab.scss';

class FAB extends Component {
	static contextTypes = {
		hammer: PropTypes.object,
	};
	componentWillMount() {
		this.state = {
			isActive: false,
			mode: null,
			isDragOver: false,
		};

		this.dragEvents = {
			onDragOver: ::this.onOver,
			onDragOut: ::this.onOut,
			onDrop: ::this.onDrop,
		};
	}
	componentDidMount() {
		this.disposeHook = this.context.hammer.createHook(
			() => this.setState({ mode: 'copy' }),
			null,
			() => this.setState({ mode: null }),
		);
	}
	compnentWillUnmount() {
		this.disposeHook();
	}
	render() {
		const { className } = this.props;
		const { isActive, mode, isDragOver } = this.state;
		const Icon = !mode ? ContentAddIcon : ContentCopyIcon;
		const clickAction = !isActive ? ::this.active : ::this.deactive;
		return (
			<Droppable {...this.dragEvents}>
				<div className={cx(className, css.root, {
					[css.active]: isActive
				})}>
					<div className={css.floating}>
						<FAButton ref="button" onClick={clickAction} secondary={isDragOver}>
							<Icon className={css.icon}/>
						</FAButton>
					</div>
					<Dim active={isActive} style={{zIndex: 101}} onClick={::this.deactive}/>
				</div>
			</Droppable>
		);
	}
	onOver() {
		this.setState({ isDragOver: true });
	}
	onOut() {
		this.setState({ isDragOver: false });
	}
	onDrop() {
		this.setState({ isDragOver: false });
	}
	active() {
		this.setState({ isActive: true });
	}
	deactive() {
		this.setState({ isActive: false });
	}
}

export default FAB;

