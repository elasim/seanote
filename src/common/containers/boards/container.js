import flow from 'lodash/flow';
import connect from 'react-redux/lib/components/connect';
import bindActionCreators from 'redux/lib/bindActionCreators';
import injectHammer from '../../lib/dnd/inject-hammer';
import { setDim } from '../../actions/app';
import BoardActions from '../../actions/board';
import ListActions from '../../actions/list';
import Board from './boards';

export default flow(
	connect(mapStateToProps, mapDispatchToProps),
	injectHammer()
)(Board);

function mapStateToProps(state, props) {
	return {
		headerVisibility: state.app.headerVisibility,
		board: state.board,
		list: state.list[props.params.id],
	};
}

function mapDispatchToProps(dispatch) {
	return {
		setDim: (dimArg) => dispatch(setDim(dimArg)),
		boardAction: bindActionCreators(BoardActions, dispatch),
		listActions: bindActionCreators(ListActions, dispatch),
	};
}
