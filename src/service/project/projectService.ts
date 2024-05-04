import { getUserProfile } from "../../DB/userDbFunctions";
import { getAllProjects, addProject, getMyProjects, updateProject, checkProjectOwner, shortlistApplicant, rejectApplicant, deleteProject } from "../../DB/projectDbFunctions"

export const postProjectService = async (req: any, res: any) => {
  try {
    const { user_id } = await getUserProfile(req.decoded.email);
    const projectInfo = req.body;
    await addProject(user_id, projectInfo);
    res.status(200).json("Project added successfully");
  } catch (err: any) {
    console.log(err.message);
    res.status(401).json(err.message);
  }
};

export const getAllProjectsService = async (req: any, res: any) => {
  try {
    const allProjects = await getAllProjects();
    res.status(200).json(allProjects);
  } catch (err: any) {
    res.status(401).json(err.message);
  }
};

export const getMyProjectsService = async (req: any, res: any) => {
  try {
    const { user_id } = await getUserProfile(req.decoded.email);
    const myProjects = await getMyProjects(user_id);
    res.status(200).json(myProjects);
  } catch (err: any) {
    res.status(401).json(err.message);
  }
};

export const editProjectService = async (req: any, res: any) => {
  try {
    const { user_id } = await getUserProfile(req.decoded.email);
    const project_id = req.query.project_id;
    if (await checkProjectOwner(user_id, project_id) === false) {
      res.status(401).json("You are not authorized to edit this project");
      return;
    }
    const projectInfo = req.body;
    await updateProject(project_id, projectInfo);
    res.status(200).json("Project updated successfully");
  } catch (err: any) {
    res.status(401).json(err.message);
  }
};

export const deleteProjectService = async (req: any, res: any) => {
  try {
    const { user_id } = await getUserProfile(req.decoded.email);
    const project_id = req.query.project_id;
    if (await checkProjectOwner(user_id, project_id) === false) {
      res.status(401).json("You are not authorized to delete this project");
      return;
    }
    await deleteProject(project_id);
    res.status(200).json("Project deleted successfully");
  } catch (err: any) {
    res.status(401).json(err.message);
  }
}

export const shortlistApplicantService = async (req: any, res: any) => {
  try {
    const { user_id } = await getUserProfile(req.decoded.email);
    const project_id = req.query.project_id;
    if (await checkProjectOwner(user_id, project_id) === false) {
      res.status(401).json("You are not authorized to shortlist applicants for this project");
      return;
    }
    const applicant_id = req.query.applicant_id; // user_id of the applicant from the projects table.
    await shortlistApplicant(project_id, applicant_id);
    res.status(200).json("Applicant shortlisted successfully");
  } catch (err: any) {
    res.status(401).json(err.message);
  }
};

export const rejectApplicantService = async (req: any, res: any) => {
  try {
    const { user_id } = await getUserProfile(req.decoded.email);
    const project_id = req.query.project_id;
    if (await checkProjectOwner(user_id, project_id) === false) {
      res.status(401).json("You are not authorized to reject applicants for this project");
      return;
    }
    const applicant_id = req.query.applicant_id;
    await rejectApplicant(project_id, applicant_id);
    res.status(200).json("Applicant rejected successfully");
  } catch (err: any) {
    res.status(401).json(err.message);
  }
}