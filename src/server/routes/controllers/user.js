import { Controller } from './controller';
import { User } from '../../data';

export default class UserController extends Controller {
	constructor(...args) {
		super(UserController, ...args);

		User.sync();
	}
	postLogin(session, body) {
		User
	}
	put(session, body) {
	}
}
