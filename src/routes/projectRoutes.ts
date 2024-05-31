import "dotenv/config";
import { Router } from "express";
import bodyParser from "body-parser";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
  getAllProjectsService,
  postProjectService,
  getMyProjectsService,
  getProjectService,
  editProjectService,
  shortlistApplicantService,
  rejectApplicantService,
  deleteProjectService,
  editProjectStatusService,
  addApplicationService,
  deleteApplicationService,
  editApplicationService,
  getApplicantsService,
  acceptApplicantService,
} from "../service/project/projectService";

const router = Router();
router.use(bodyParser.json());

router.post("/postProject", authMiddleware, postProjectService);
router.get("/all", getAllProjectsService);
router.get("/myProjects", authMiddleware, getMyProjectsService);
router.get("/projectApplicants", authMiddleware, getApplicantsService);
router.get("/:id", authMiddleware, getProjectService);
router.put("/editProject", authMiddleware, editProjectService);
router.delete("/deleteProject", authMiddleware, deleteProjectService);

router.put("/editProjectStatus", authMiddleware, editProjectStatusService);

router.post("/applyProject", authMiddleware, addApplicationService);
router.put("/editApplication", authMiddleware, editApplicationService); // to change the role for which the user applied for.
router.delete("/deleteApplication", authMiddleware, deleteApplicationService);

router.post("/acceptApplicant", authMiddleware, acceptApplicantService);
router.put("/shortlistApplicant", authMiddleware, shortlistApplicantService);
router.put("/rejectApplicant", authMiddleware, rejectApplicantService);

export default router;
