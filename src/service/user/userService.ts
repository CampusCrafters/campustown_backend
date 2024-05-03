import { getUserProfile, updateUserProfile, addProfileProject, editProfileProject, getProfileProject, checkProfileProjectOwner, deleteProfileProject } from "../../DB/dbFunctions";

export const viewProfileService = async (req: any, res: any) => {
  try {       
      const profileInfo = await getUserProfile(req.decoded.email);
      res.status(200).json(profileInfo);
  } catch (error: any) {
    res.status(401).json(error.message);
  }
};

export const editProfileService = async (req: any, res: any) => {
  try {
      const email = req.decoded.email;
      const updatedInfo = req.body;
      await updateUserProfile(email, updatedInfo);
      res.status(200).json("User info updated successfully");
  } catch (error: any) {
    res.status(401).json(error.message);
  }
};

export const addProfileProjectService = async (req: any, res: any, next: any) => {
  try {
    const { user_id } = await getUserProfile(req.decoded.email);
    const projectInfo = req.body;
    await addProfileProject(user_id, projectInfo);
    res.status(200).json("Project added successfully");
  } catch (error: any) {
    res.status(401).json(error.message);
  }
}

export const viewProfileProjectService = async (req: any, res: any) => {
  try {
    const profileProjects = await getProfileProject(req.query.user_id);
    res.status(200).json(profileProjects);
  } catch (error: any) {
    res.status(401).json(error.message);
  }
}

export const editProfileProjectService = async (req: any, res: any) => {
  try {
      const { user_id } = await getUserProfile(req.decoded.email);
      const user_project_id = req.query.user_project_id;
      if(await checkProfileProjectOwner(user_id, user_project_id) === false) {
        res.status(401).json("You are not authorized to edit this project");
      }
      const projectInfo = req.body;
      await editProfileProject(user_project_id, projectInfo);
      res.status(200).json("Profile project updated successfully");
  } catch (error: any) {
    res.status(401).json(error.message);
  }
}

export const deleteProfileProjectService = async (req: any, res: any) => { 
  try {
    const { user_id } = await getUserProfile(req.decoded.email);
    const user_project_id = req.query.user_project_id;
    if(await checkProfileProjectOwner(user_id, user_project_id) === false) {
      res.status(401).json("You are not authorized to delete this project");
    }
    await deleteProfileProject(user_project_id);
    res.status(200).json("Profile project deleted successfully");
  } catch (error: any) {
    res.status(401).json(error.message);
  }
}
