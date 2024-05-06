import "dotenv/config";
import { Router } from "express";
import bodyParser from "body-parser";
import multer from "multer";
import { authMiddleware } from "../middlewares/authMiddleware";
<<<<<<< Updated upstream
import { signinService, getTokensAndStoreDataService, verifyTokenService } from "../service/auth/authService";
import { viewProfileService, editProfileService, addProfileProjectService, viewProfileProjectService, editProfileProjectService, deleteProfileProjectService, viewExperienceService, addExperienceService, editExperienceService, deleteExperienceService, getMyApplicationsService, profilePictureService, viewProfilePictureService } from "../service/user/userService";
=======
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
  getMyApplicationsService,
  addProfilePictureService,
  viewProfilePictureService,
  addResumeService,
  viewResumeService,
} from "../service/user/userService";
>>>>>>> Stashed changes

const router = Router();
router.use(bodyParser.json());

<<<<<<< Updated upstream
const storage = multer.memoryStorage();
const upload = multer({ storage: storage}); // hello
=======
//const upload = multer({ dest: "uploads/" });

const storage: any = multer.memoryStorage();
const upload = multer({ storage: storage });
>>>>>>> Stashed changes

router.post("/gsignin", signinService);
router.get("/oauth", getTokensAndStoreDataService);
router.post("/verifyToken", verifyTokenService);

router.get("/viewProfile", viewProfileService);
router.put("/editProfile", authMiddleware, editProfileService);
<<<<<<< Updated upstream
router.post("/addProfilePicture", authMiddleware, upload.single('image'), profilePictureService);
router.put("/editProfilePicture", authMiddleware, upload.single('image'), profilePictureService);
router.delete("/deleteProfilePicture", authMiddleware, profilePictureService);
=======
router.post(
  "/addProfilePicture",
  authMiddleware,
  upload.single("image"),
  addProfilePictureService
);
>>>>>>> Stashed changes
router.get("/viewProfilePicture", viewProfilePictureService);

router.post(
  "/addResume",
  authMiddleware,
  upload.single("file"),
  addResumeService
);
//router.delete("/deleteResume", authMiddleware, deleteResumeService);
router.get("/viewResume", authMiddleware, viewResumeService);

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

router.get("/myApplications", authMiddleware, getMyApplicationsService);

export default router;
