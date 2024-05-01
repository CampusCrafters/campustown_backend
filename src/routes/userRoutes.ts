import 'dotenv/config';
import { Router } from 'express';
import bodyParser from 'body-parser';
import {signinService, getTokensAndStoreDataService, verifyTokenService} from '../service/auth/authService'
import {viewProfileService} from '../service/user/userService'

const router = Router();
router.use(bodyParser.json());

router.post('/gsignin', signinService);
router.get('/oauth', getTokensAndStoreDataService);
router.post('/verifyToken', verifyTokenService);

router.get('/viewProfile', viewProfileService);
//router.post('/editProfile', editProfileService);

export default router;
