import 'dotenv/config';
import { Router } from 'express';
import bodyParser from 'body-parser';
import { signinService, getTokensAndStoreDataService, verifyTokenService } from '../service/auth/authService'
import { viewProfileService, editProfileService, addProfileProjectService, viewProfileProjectService, editProfileProjectService, deleteProfileProjectService } from '../service/user/userService'

const router = Router();
router.use(bodyParser.json());

router.post('/gsignin', signinService);
router.get('/oauth', getTokensAndStoreDataService);
router.post('/verifyToken', verifyTokenService);

router.get('/viewProfile', viewProfileService);
router.put('/editProfile', editProfileService);

router.post('/addProfileProject', addProfileProjectService);
router.get('/viewProfileProject', viewProfileProjectService);
router.put('/editProfileProject', editProfileProjectService);
router.delete('/deleteProfileProject', deleteProfileProjectService);

//router.post('/addExperience', addExperienceService);
//router.put('/editExperience', editExperienceService);
//router.delete('/deleteExperience', deleteExperienceService);

// router.get('/myApplications', getMyApplicationsService);

export default router;
