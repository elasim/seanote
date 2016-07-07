import { Controller, ActionResult } from './controller';
import { User, UserLogin } from '../../data';
import passport from 'passport';

export default class UserController extends Controller {
	constructor(...args) {
		super(UserController);

		User.sync();
	}
	get() {
		return ActionResult.json({
			hello: 'World'
		});
	}
	postLogin(session, body) {
		if (session.token) {
			return ActionResult.Status(208);
		}
		const { email, password } = body;
		// Where is passport?
		UserLogin.findOne({
			email: email.trim(),
			key: password,
		});
	}
	put(session, body) {
	}
}
