import "dotenv/config"; 
import { Router } from "express"; 
import bodyParser from "body-parser"; 
import multer from "multer"; 
import { authMiddleware } from "../middlewares/authMiddleware"; 
import { signinService, getTokensAndStoreDataService, verifyTokenService } from "../service/auth/authService"; 
import { viewProfileService, editProfileService, addProfileProjectService, viewProfileProjectService, editProfileProjectService, deleteProfileProjectService, viewExperienceService, addExperienceService, editExperienceService, deleteExperienceService, getMyApplicationsService, profilePictureService, addResumeService, viewResumeService, deleteResumeService } from "../service/user/userService";

const router = Router(); router.use(bodyParser.json());
const storage = multer.memoryStorage(); const upload = multer({ storage: storage });

router.post("/gsignin", signinService); 
router.get("/oauth", getTokensAndStoreDataService); 
router.get("/verifyToken", verifyTokenService);

router.get("/viewProfile", viewProfileService); 
router.put("/editProfile", authMiddleware, editProfileService); 
router.post("/addProfilePicture", authMiddleware, upload.single("image"), profilePictureService); 
router.put("/editProfilePicture", authMiddleware, upload.single("image"), profilePictureService); 
router.delete("/deleteProfilePicture", authMiddleware, profilePictureService); 
router.get("/viewProfilePicture", profilePictureService);
router.post("/addResume", authMiddleware, upload.single("file"), addResumeService); 
router.delete("/deleteResume", authMiddleware, deleteResumeService); 
router.get("/viewResume", authMiddleware, viewResumeService);

router.get("/viewProfileProject", viewProfileProjectService); 
router.post("/addProfileProject", authMiddleware, addProfileProjectService); 
router.put("/editProfileProject", authMiddleware, editProfileProjectService); 
router.delete("/deleteProfileProject", authMiddleware, deleteProfileProjectService);

router.get("/viewExperience", viewExperienceService); 
router.post("/addExperience", authMiddleware, addExperienceService); 
router.put("/editExperience", authMiddleware, editExperienceService); 
router.delete("/deleteExperience", authMiddleware, deleteExperienceService);

router.get("/myApplications", authMiddleware, getMyApplicationsService);

export default router;
