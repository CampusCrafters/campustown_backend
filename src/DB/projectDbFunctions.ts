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

export const addProject = async (user_id: number, projectInfo: object) => {
  try {
    const client = await pool.connect();

    const query = {
      text:
        "INSERT INTO projects (host_id, members, project_title, description, domain, required_roles, start_date, end_date, applicants, shortlisted, rejected)" +
        "VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)",
      values: [user_id, ...Object.values(projectInfo)],
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

export const updateProject = async (project_id: number, projectinfo: object) => {
  try {
    const client = await pool.connect();
    const projectfields = Object.keys(projectinfo);
    const query = `UPDATE projects SET ${projectfields
      .map((field, index) => `${field} = $${index + 1}`)
      .join(", ")} WHERE project_id = $${projectfields.length + 1}`;

    const values = [...Object.values(projectinfo), project_id];
    await client.query(query, values);
    client.release();
  } catch (err: any) {
    console.error("Error updating project: ", err.message);
    throw new Error("Error updating project");
  }
};

export const checkProjectOwner = async (host_id: number, project_id: number) => {
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
