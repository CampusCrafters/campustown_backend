import 'dotenv/config';
import { Router, Request, Response } from 'express';
import bodyParser from 'body-parser';

const router = Router();
router.use(bodyParser.json());

// router.get('/projects', getAllProjectsService);
// router.get('/myProjects', getMyProjectsService);
// router.get('/applications', getApplicantsService);

// router.post('/applyProject', addApplicationService);
// //router.post('/addProject', addProjectService);



export default router;
