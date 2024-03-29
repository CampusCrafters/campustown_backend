import 'dotenv/config';
import { Router, Request, Response } from 'express';
import bodyParser from 'body-parser';
import {signinService, getTokensAndStoreDataService, verifyTokenService} from '../service/authService'

const router = Router();
router.use(bodyParser.json());

router.post('/gsignin', signinService);
router.get('/oauth', getTokensAndStoreDataService);
router.get('/verifyToken', verifyTokenService);

export default router;
