import { getUserProfile } from "../../DB/userDbFunctions";
import {
  getAllProjects,
  addProject,
  getMyProjects,
  updateProject,
  updateProjectStatus,
  checkProjectOwner,
  shortlistApplicant,
  rejectApplicant,
  deleteProject,
  addApplication,
  deleteApplication,
  changeRole,
  getApplicants,
  acceptApplicant,
  checkApplicationExists,
  getApplicantName,
} from "../../DB/projectDbFunctions";

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
    if ((await checkProjectOwner(user_id, project_id)) === false) {
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
    if ((await checkProjectOwner(user_id, project_id)) === false) {
      res.status(401).json("You are not authorized to delete this project");
      return;
    }
    await deleteProject(project_id);
    res.status(200).json("Project deleted successfully");
  } catch (err: any) {
    res.status(401).json(err.message);
  }
};

export const editProjectStatusService = async (req: any, res: any) => {
  try {
    const { user_id } = await getUserProfile(req.decoded.email);
    const project_id = req.query.project_id;
    if ((await checkProjectOwner(user_id, project_id)) === false) {
      res
        .status(401)
        .json("You are not authorized to edit the status of this project");
      return;
    }
    const status = req.query.status;
    await updateProjectStatus(project_id, status);
    res.status(200).json("Project status updated successfully");
  } catch (err: any) {
    res.status(401).json(err.message);
  }
};

export const shortlistApplicantService = async (req: any, res: any) => {
  try {
    const { user_id } = await getUserProfile(req.decoded.email);
    const project_id = req.query.project_id;
    if ((await checkProjectOwner(user_id, project_id)) === false) {
      res
        .status(401)
        .json(
          "You are not authorized to shortlist applicants for this project"
        );
      return;
    }
    const applicant_id = req.query.applicant_id; // user_id of the applicant from the Project Applications table.
    const role_name = req.query.role_name;
    await shortlistApplicant(project_id, role_name, applicant_id);
    res.status(200).json("Applicant shortlisted successfully");
  } catch (err: any) {
    res.status(401).json(err.message);
  }
};

export const rejectApplicantService = async (req: any, res: any) => {
  try {
    const { user_id } = await getUserProfile(req.decoded.email);
    const project_id = req.query.project_id;
    if ((await checkProjectOwner(user_id, project_id)) === false) {
      res
        .status(401)
        .json("You are not authorized to reject applicants for this project");
      return;
    }
    const applicant_id = req.query.applicant_id;
    const role_name = req.query.role_name;
    await rejectApplicant(project_id, applicant_id, role_name);
    res.status(200).json("Applicant rejected successfully");
  } catch (err: any) {
    res.status(401).json(err.message);
  }
};

export const addApplicationService = async (req: any, res: any) => {
  try {
    const { user_id } = await getUserProfile(req.decoded.email);
    const applicant_name = await getApplicantName(user_id);
    const { project_id, role } = req.body;
    const status = "Pending";
    if (await checkProjectOwner(user_id, project_id)) {
      res.status(401).json("You cannot apply to your own project");
    } else if (await checkApplicationExists(user_id, project_id, role)) {
      res.status(401).json("You have already applied to this project");
    } else {
      await addApplication(user_id, status, project_id, role, applicant_name);
      res.status(200).json("Application added successfully");
    }
  } catch (error) {
    res.status(401).json("Error in addApplicationService");
  }
};

export const deleteApplicationService = async (req: any, res: any) => {
  try {
    const { user_id } = await getUserProfile(req.decoded.email);
    const { project_id, role } = req.body;    
    if (!(await checkApplicationExists(user_id, project_id, role))) {
      res.status(401).json("You have not applied to this project");
      return;
    }
    await deleteApplication(user_id, project_id, role);
    res.status(200).json("Application deleted successfully");
  } catch (error) {
    res.status(401).json("Error in deleteApplicationService");
  }
};

export const editApplicationService = async (req: any, res: any) => {
  try {
    const { user_id } = await getUserProfile(req.decoded.email);
    const { project_id, role, newRole } = req.body;
    if(!(await checkApplicationExists(user_id, project_id, role))) {
      res.status(401).json("You have not applied to this project");
      return;
    }
    await changeRole(user_id, project_id, role, newRole);
    res.status(200).json("Application edited successfully");
  } catch (error) {
    res.status(401).json("Error in editApplicationService");
  }
};

export const getApplicantsService = async (req: any, res: any) => {
  try {
    const project_id = req.query.project_id;
    const applicants = await getApplicants(project_id);
    res.status(200).json(applicants);
  } catch (error) {
    res.status(401).json("Error in getApplicantsService");
  }
};

export const acceptApplicantService = async (req: any, res: any) => {
  try {
    const { user_id } = await getUserProfile(req.decoded.email);
    const project_id = req.query.project_id;
    const applicant_id = req.query.applicant_id;
    const role_name = req.query.role_name;
    if ((await checkProjectOwner(user_id, project_id)) === false) {
      res.status(401).json("You are not authorized to accept this applicant");
      return;
    }
    await acceptApplicant(project_id, role_name, applicant_id);
    res.status(200).json("Applicant accepted successfully");
  } catch (error) {
    res.status(401).json("Error in acceptApplicantService");
  }
};
