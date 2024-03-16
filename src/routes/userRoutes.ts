import 'dotenv/config';
import { Router, Request, Response } from 'express';
import bodyParser from 'body-parser';
import {signinService, getTokensAndStoreDataService} from '../service/authServices'

const router = Router();
router.use(bodyParser.json());

router.post('/gsignin', signinService);
router.get('/oauth', getTokensAndStoreDataService);

export default router;
