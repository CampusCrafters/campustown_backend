import {
  getAllProjects,
  getUserProfile,
  addProject,
  getMyProjects,
  updateProject,
  checkProjectOwner,
} from "../../DB/dbFunctions";

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
    //console.log(allProjects);
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
    }
    const projectInfo = req.body;
    await updateProject(project_id, projectInfo);
    res.status(200).json("Project updated successfully");
  } catch (err: any) {
    res.status(401).json(err.message);
  }
};
