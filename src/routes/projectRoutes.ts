import 'dotenv/config';
import { Router, Request, Response } from 'express';
import bodyParser from 'body-parser';

const router = Router();
router.use(bodyParser.json());

// router.post('/postProject', postProjectService);
// router.get('/projects', getAllProjectsService);
// router.get('/myProjects', getMyProjectsService);

// router.post('/applyProject', addApplicationService);
// router.put('/editApplication', editApplicationService);
// router.delete('/deleteApplication', deleteApplicationService);

// router.get('/projectApplicants', getProjectApplicantsService);
// router.post('/acceptApplicant', acceptApplicantService);
// router.post('/shortlistApplicant', shortlistApplicantService);
// router.post('/rejectApplicant', rejectApplicantService);

export default router;
