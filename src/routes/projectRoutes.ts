import 'dotenv/config';
import { Router, Request, Response } from 'express';
import bodyParser from 'body-parser';

const router = Router();
router.use(bodyParser.json());

// router.post('/addProject', addProjectService);
// router.get('/projects', getAllProjectsService);

// router.get('/myProjects', getMyProjectsService);
// router.get('/applications', getApplicantsService);
// router.post('/applyProject', addApplicationService);



export default router;
