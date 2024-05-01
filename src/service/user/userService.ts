import { verifyJWT } from "../auth/authHelper";
import { getUserProfile, updateUserProfile } from "../../DB/dbFunctions";

export const viewProfileService = async (req: any, res: any) => {
  const token = req.cookies.jwt;
  if (!token) {
    console.log("No token in the query");
    return res.status(400).json("No token provided");
  }
  try {
    const decoded = await verifyJWT(token);
    if (decoded && typeof decoded === "object") {
      const email = decoded.email;
      const profileInfo = await getUserProfile(email);
      res.status(200).json(profileInfo);
    }
  } catch (error) {
    res.status(401).json("Unauthorized access");
  }
};

export const editProfileService = async (req: any, res: any) => {
  const token = req.cookies.jwt;
  if (!token) {
    console.log("No token in the query");
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
  } catch (error) {
    res.status(401).json("Error in updateUserProfileService");
  }
};
