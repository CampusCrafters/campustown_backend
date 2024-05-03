import { getUserProfile } from "../../DB/userDbFunctions";
import { postProject } from "../../DB/projectDbFunctions";

export const postProjectService = async (req: any, res: any) => {
    try {
        const { user_id } = await getUserProfile(req.decoded.email);
        const projectInfo = req.body;
        await postProject(user_id, projectInfo);
        res.status(200).json("Project posted successfully");
    } catch (error: any) {
        res.status(401).json(error.message);
    }
}
