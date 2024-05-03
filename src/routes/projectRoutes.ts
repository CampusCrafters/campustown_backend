<<<<<<< Updated upstream
import 'dotenv/config';
import { Router } from 'express';
import bodyParser from 'body-parser';
=======
import "dotenv/config";
import { Router, Request, Response } from "express";
import bodyParser from "body-parser";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
  getAllProjectsService,
  postProjectService,
  getMyProjectsService,
  editProjectService,
} from "../service/project/projectService";
>>>>>>> Stashed changes

const router = Router();
router.use(bodyParser.json());

<<<<<<< Updated upstream
//router.post('/postProject', authMiddleware, postProjectService);
//router.get('/projects', getAllProjectsService);
// router.get('/myProjects', getMyProjectsService);
// router.put('/editProject', authMiddleware, editProjectService);
=======
router.post("/postProject", authMiddleware, postProjectService);
router.get("/all", getAllProjectsService);
router.get("/myProjects", authMiddleware, getMyProjectsService);
router.put("/editProject", authMiddleware, editProjectService);
>>>>>>> Stashed changes

// router.post('/applyProject', addApplicationService);
// router.put('/editApplication', editApplicationService);
// router.delete('/deleteApplication', deleteApplicationService);

// router.get('/projectApplicants', getApplicantsService);
// router.post('/acceptApplicant', acceptApplicantService);
// router.post('/shortlistApplicant', shortlistApplicantService);
// router.post('/rejectApplicant', rejectApplicantService);

export default router;
