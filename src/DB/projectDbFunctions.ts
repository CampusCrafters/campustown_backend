import { pool } from "./tables";

export const getAllProjects = async () => {
  try {
    const client = await pool.connect();
    const query = {
      text: "SELECT * FROM projects",
    };
    const result = await client.query(query);
    client.release();
    return result.rows;
  } catch (err) {
    console.error("Error in getting all projects: ", err);
    throw new Error("Error in getting all projects");
  }
};

export const addProject = async (user_id: number, projectInfo: any) => {
  try {
    const client = await pool.connect();
    const query = {
      text:
        "INSERT INTO projects (host_id, members, project_title, description, domain, link, required_roles, start_date, end_date, status, posted_on)" +
        "VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)",
      values: [
        user_id,
        JSON.stringify(projectInfo.members), // Stringify the members array
        projectInfo.project_title,
        projectInfo.description,
        projectInfo.domain,
        projectInfo.link,
        projectInfo.required_roles,
        projectInfo.start_date,
        projectInfo.end_date,
        projectInfo.status,
        new Date().toISOString(), // Get the current date and time
      ],
    };

    await client.query(query);
    client.release();
  } catch (err: any) {
    console.error("Error adding project: ", err.message);
    throw new Error("Error adding project");
  }
};

export const getMyProjects = async (user_id: number) => {
  try {
    const client = await pool.connect();
    const query = {
      text: "SELECT * FROM projects WHERE host_id = $1",
      values: [user_id],
    };
    const result = await client.query(query);
    client.release();
    return result.rows;
  } catch (err: any) {
    console.error("Error getting my projects: ", err.message);
    throw new Error("Error getting my projects");
  }
};

interface ProjectInfo {
  [key: string]: any;
}

export const updateProject = async (
  project_id: number,
  projectinfo: ProjectInfo
) => {
  try {
    const client = await pool.connect();
    const projectfields = Object.keys(projectinfo).filter(
      (field) => field !== "posted_on"
    );
    const setClause = projectfields
      .map((field, index) => `${field} = $${index + 1}`)
      .join(", ");
    const query = `UPDATE projects SET ${setClause}, edited_on = $${
      projectfields.length + 1
    } WHERE project_id = $${projectfields.length + 2}`;
    const values = projectfields
      .map((field) => projectinfo[field])
      .concat(new Date(new Date().toLocaleString()), project_id);
    await client.query(query, values);
    client.release();
  } catch (err: any) {
    console.error("Error updating project: ", err.message);
    throw new Error("Error updating project");
  }
};

export const deleteProject = async (project_id: number) => {
  try {
    const client = await pool.connect();
    const query = {
      text: "DELETE FROM projects WHERE project_id = $1",
      values: [project_id],
    };
    await client.query(query);
    client.release();
  } catch (err: any) {
    console.error("Error deleting project: ", err.message);
    throw new Error("Error deleting project");
  }
};

export const updateProjectStatus = async (
  project_id: number,
  status: string
) => {
  try {
    const client = await pool.connect();
    const query = {
      text: "UPDATE projects SET status = $1, edited_on = $2 WHERE project_id = $3",
      values: [status, new Date().toLocaleString(), project_id],
    };
    await client.query(query);
    client.release();
  } catch (err: any) {
    console.error("Error updating project status: ", err.message);
    throw new Error("Error updating project status");
  }
};

export const checkProjectOwner = async (
  host_id: number,
  project_id: number
) => {
  try {
    const client = await pool.connect();
    const query = {
      text: "SELECT EXISTS (SELECT 1 FROM projects WHERE host_id = $1 AND project_id = $2)",
      values: [host_id, project_id],
    };
    const result = await client.query(query);
    client.release();
    return result.rows[0].exists;
  } catch (error) {
    console.error("Error checking project owner in database:", error);
    throw new Error("Error checking project owner in database");
  }
};

export const shortlistApplicant = async (
  project_id: number,
  role_name: string,
  applicant_id: number
) => {
  try {
    const client = await pool.connect();
    const updateProjectApplicationsTable = {
      text: `
        UPDATE project_applications 
        SET status = 'Shortlisted'
        WHERE project_id = $1 AND user_id = $2 AND role = $3
      `,
      values: [project_id, applicant_id, role_name],
    };
    await client.query(updateProjectApplicationsTable);
    client.release();
  } catch (error: any) {
    console.error("Error shortlisting applicant in database:", error.message);
    throw new Error("Error shortlisting applicant in database");
  }
};

export const rejectApplicant = async (
  project_id: number,
  role_name: string,
  applicant_id: number
) => {
  try {
    const client = await pool.connect();
    const updateProjectApplicationsTable = {
      text: `
        UPDATE project_applications 
        SET status = 'Rejected'
        WHERE project_id = $1 AND user_id = $2 AND role = $3
      `,
      values: [project_id, applicant_id, role_name],
    };
    await client.query(updateProjectApplicationsTable);
    client.release();
  } catch (error: any) {
    console.error("Error rejecting applicant in database:", error.message);
    throw new Error("Error rejecting applicant in database");
  }
};
