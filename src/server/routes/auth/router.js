import { Router } from 'express';
import bodyParser from 'body-parser';
// import { User, UserLogin, UserProfile, } from '../../data';

const router = new Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

export default router;
