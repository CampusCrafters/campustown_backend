import { verifyJWT } from "../auth/authHelper";
import { getUserProfile, updateUserProfile, addMyProject, editMyProject } from "../../DB/dbFunctions";

export const viewProfileService = async (req: any, res: any) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(400).json("No token provided");
  }
  try {       
    const decoded = await verifyJWT(token);
    if (decoded && typeof decoded === "object") {
      const email = decoded.email;
      const profileInfo = await getUserProfile(email);
      res.status(200).json(profileInfo);
    }
  } catch (error: any) {
    res.status(401).json(error.message);
  }
};

export const editProfileService = async (req: any, res: any) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(400).json("No token provided");
  }
  try {
    const decoded = await verifyJWT(token);
    if (decoded && typeof decoded === "object") {
      const email = decoded.email;
      const updatedInfo = req.body;
      await updateUserProfile(email, updatedInfo);
      res.status(200).json("User info updated successfully");
    }
  } catch (error: any) {
    res.status(401).json(error.message);
  }
};

export const addMyProjectService = async (req: any, res: any) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(400).json("No token provided");
  }
  try {
    const decoded = await verifyJWT(token);
    if (decoded && typeof decoded === "object") {
      const email = decoded.email;
      const { user_id } = await getUserProfile(email);
      const projectInfo = req.body;
      await addMyProject(user_id, projectInfo);
      res.status(200).json("Project added successfully");
    }
  } catch (error: any) {
    res.status(401).json(error.message);
  }
}

export const editMyProjectService = async (req: any, res: any) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(400).json("No token provided");
  }
  try {
    const decoded = await verifyJWT(token);
    if (decoded && typeof decoded === "object") {
      const email = decoded.email;
      const { user_id } = await getUserProfile(email);
      const projectInfo = req.body;
      await editMyProject(user_id, projectInfo);
      res.status(200).json("Project added successfully");
    }
  } catch (error: any) {
    res.status(401).json(error.message);
  }
}
