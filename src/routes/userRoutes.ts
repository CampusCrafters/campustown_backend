import "dotenv/config";
import { Router } from "express";
import bodyParser from "body-parser";
import multer from "multer";
import { authMiddleware } from "../middlewares/authMiddleware";
import { signinService, getTokensAndStoreDataService, verifyTokenService } from "../service/auth/authService";
import { viewProfileService, editProfileService, addProfileProjectService, viewProfileProjectService, editProfileProjectService, deleteProfileProjectService, viewExperienceService, addExperienceService, editExperienceService, deleteExperienceService, getMyApplicationsService, addProfilePictureService, viewProfilePictureService } from "../service/user/userService";

const router = Router();
router.use(bodyParser.json());

const upload = multer({ dest: 'uploads/' });

router.post("/gsignin", signinService);
router.get("/oauth", getTokensAndStoreDataService);
router.post("/verifyToken", verifyTokenService);

router.get("/viewProfile", viewProfileService);
router.put("/editProfile", authMiddleware, editProfileService);
router.post("/addProfilePicture", authMiddleware, upload.single('image'), addProfilePictureService);
router.get("/viewProfilePicture", viewProfilePictureService);
//router.delete("/deleteProfilePicture", authMiddleware, deleteProfilePictureService);

//router.post("/addResume", authMiddleware, addResumeService);
//router.delete("/deleteResume", authMiddleware, deleteResumeService);
//router.get("/viewResume", viewResumeService);

router.get("/viewProfileProject", viewProfileProjectService);
router.post("/addProfileProject", authMiddleware, addProfileProjectService);
router.put("/editProfileProject", authMiddleware, editProfileProjectService);
router.delete("/deleteProfileProject", authMiddleware, deleteProfileProjectService);

router.get("/viewExperience", viewExperienceService);
router.post("/addExperience", authMiddleware, addExperienceService);
router.put("/editExperience", authMiddleware, editExperienceService);
router.delete("/deleteExperience", authMiddleware, deleteExperienceService);

router.get('/myApplications', authMiddleware, getMyApplicationsService);

export default router;
