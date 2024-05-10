import "dotenv/config";
import { Router } from "express";
import bodyParser from "body-parser";
import { authMiddleware } from "../middlewares/authMiddleware";
import { getAllProjectsService, postProjectService, getMyProjectsService, editProjectService, shortlistApplicantService, rejectApplicantService, deleteProjectService, editProjectStatusService } from "../service/project/projectService";

const router = Router();
router.use(bodyParser.json());

router.post("/postProject", authMiddleware, postProjectService);
router.get("/all", getAllProjectsService);
router.get("/myProjects", authMiddleware, getMyProjectsService);
router.put("/editProject", authMiddleware, editProjectService);
router.delete("/deleteProject", authMiddleware, deleteProjectService);

router.put("/editProjectStatus", authMiddleware, editProjectStatusService);

// router.post('/applyProject', addApplicationService);
// router.put('/editApplication', editApplicationService); // to change the role for which the user applied for.
// router.delete('/deleteApplication', deleteApplicationService);

// router.get('/projectApplicants', getApplicantsService);
// router.post('/acceptApplicant', acceptApplicantService);
router.put('/shortlistApplicant', shortlistApplicantService);
router.put('/rejectApplicant', rejectApplicantService);

export default router;
