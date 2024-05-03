import "dotenv/config";
import { Router } from "express";
import bodyParser from "body-parser";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
  signinService,
  getTokensAndStoreDataService,
  verifyTokenService,
} from "../service/auth/authService";
import {
  viewProfileService,
  editProfileService,
  addProfileProjectService,
  viewProfileProjectService,
  editProfileProjectService,
  deleteProfileProjectService,
  viewExperienceService,
  addExperienceService,
  editExperienceService,
  deleteExperienceService,
} from "../service/user/userService";

const router = Router();
router.use(bodyParser.json());
router.post("/gsignin", signinService);
router.get("/oauth", getTokensAndStoreDataService);
router.post("/verifyToken", verifyTokenService);

router.get("/viewProfile", authMiddleware, viewProfileService);
router.put("/editProfile", authMiddleware, editProfileService);

router.get("/viewProfileProject", viewProfileProjectService);
router.post("/addProfileProject", authMiddleware, addProfileProjectService);
router.put("/editProfileProject", authMiddleware, editProfileProjectService);
router.delete(
  "/deleteProfileProject",
  authMiddleware,
  deleteProfileProjectService
);

router.get("/viewExperience", viewExperienceService);
router.post("/addExperience", authMiddleware, addExperienceService);
router.put("/editExperience", authMiddleware, editExperienceService);
router.delete("/deleteExperience", authMiddleware, deleteExperienceService);

// router.get('/myApplications', authMiddleware, getMyApplicationsService);

export default router;
