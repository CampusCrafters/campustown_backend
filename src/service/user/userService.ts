import { getUserProfile, updateUserProfile, addProfileProject, editProfileProject, getProfileProject, checkProfileProjectOwner, deleteProfileProject, getProfileExperience, addProfileExperience, checkProfileExperienceOwner, editProfileExperience, deleteProfileExperience } from "../../DB/userDbFunctions"

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
};

export const viewProfileProjectService = async (req: any, res: any) => {
  try {
    const profileProjects = await getProfileProject(req.query.user_id);
    res.status(200).json(profileProjects);
  } catch (error: any) {
    res.status(401).json(error.message);
  }
};

export const editProfileProjectService = async (req: any, res: any) => {
  try {
    const { user_id } = await getUserProfile(req.decoded.email);
    const user_project_id = req.query.user_project_id;
    if ((await checkProfileProjectOwner(user_id, user_project_id)) === false) {
      res.status(401).json("You are not authorized to edit this project");
    }
    const projectInfo = req.body;
    await editProfileProject(user_project_id, projectInfo);
    res.status(200).json("Profile project updated successfully");
  } catch (error: any) {
    res.status(401).json(error.message);
  }
};

export const deleteProfileProjectService = async (req: any, res: any) => {
  try {
    const { user_id } = await getUserProfile(req.decoded.email);
    const user_project_id = req.query.user_project_id;
    if (await checkProfileProjectOwner(user_id, user_project_id) === false) {
      res.status(401).json("You are not authorized to delete this project");
    }
    await deleteProfileProject(user_project_id);
    res.status(200).json("Profile project deleted successfully");
  } catch (error: any) {
    res.status(401).json(error.message);
  }
};

export const addExperienceService = async (req: any, res: any) => {
  try {
    const { user_id } = await getUserProfile(req.decoded.email);
    const experienceInfo = req.body;
    await addProfileExperience(user_id, experienceInfo);
    res.status(200).json("Experience added successfully");
  } catch (error: any) {
    res.status(401).json(error.message);
  }
};

export const viewExperienceService = async (req: any, res: any) => {
  try {
    const profileExperience = await getProfileExperience(req.query.user_id);
    res.status(200).json(profileExperience);
  } catch (error: any) {
    res.status(401).json(error.message);
  }
};

export const editExperienceService = async (req: any, res: any) => {
  try {
    const { user_id } = await getUserProfile(req.decoded.email);
    const user_experience_id = req.query.user_experience_id;
    if (await checkProfileExperienceOwner(user_id, user_experience_id) === false) {
      res.status(401).json("You are not authorized to edit this experience");
    }
    const experienceInfo = req.body;
    await editProfileExperience(user_experience_id, experienceInfo);
    res.status(200).json("Profile experience updated successfully");
  } catch (error: any) {
    res.status(401).json(error.message);
  }
};

export const deleteExperienceService = async (req: any, res: any) => {
  try {
    const { user_id } = await getUserProfile(req.decoded.email);
    const user_experience_id = req.query.user_experience_id;
    if (await checkProfileExperienceOwner(user_id, user_experience_id) === false) {
      res.status(401).json("You are not authorized to delete this experience");
    }
    await deleteProfileExperience(user_experience_id);
    res.status(200).json("Profile experience deleted successfully");
  } catch (error: any) {
    res.status(401).json(error.message);
  }
};
