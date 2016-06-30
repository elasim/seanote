import { Router } from 'express';
import bodyParser from 'body-parser';

import BoardController from './controllers/board';
import ListController from './controllers/list';
import UserController from './controllers/user';

const router = new Router();
const boardCtrl = new BoardController();
const listCtrl = new ListController();
const userCtrl = new UserController();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.use('/board/list', listCtrl.router);
router.use('/board', boardCtrl.router);
router.use('/user', userCtrl.router);

export default router;
