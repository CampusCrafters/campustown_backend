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
        "INSERT INTO projects (host_id, members, project_title, description, domain, link, required_roles, start_date, end_date, status, posted_on)" +
        "VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)",
      values: [
        user_id,
        ...Object.values(projectInfo),
        new Date().toLocaleString(),
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

export const acceptApplicant = async (
  project_id: number,
  role_name: string,
  applicant_id: number
) => {
  try {
    const client = await pool.connect();
    const updateProjectApplicationsTable = {
      text: `
        UPDATE project_applications 
        SET status = 'Accepted' AND reviewed_on = $4
        WHERE project_id = $1 AND user_id = $2 AND role = $3
      `,
      values: [
        project_id,
        applicant_id,
        role_name,
        new Date().toLocaleString(),
      ],
    };
    await client.query(updateProjectApplicationsTable);
    client.release();
  } catch (error: any) {
    console.error("Error accepting applicant in database:", error.message);
    throw new Error("Error accepting applicant in database");
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
        SET status = 'Shortlisted' AND reviewed_on = $4
        WHERE project_id = $1 AND user_id = $2 AND role = $3
      `,
      values: [
        project_id,
        applicant_id,
        role_name,
        new Date().toLocaleString(),
      ],
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
        SET status = 'Rejected' AND reviewed_on = $4
        WHERE project_id = $1 AND user_id = $2 AND role = $3
      `,
      values: [
        project_id,
        applicant_id,
        role_name,
        new Date().toLocaleString(),
      ],
    };
    await client.query(updateProjectApplicationsTable);
    client.release();
  } catch (error: any) {
    console.error("Error rejecting applicant in database:", error.message);
    throw new Error("Error rejecting applicant in database");
  }
};

export const addApplication = async (
  user_id: number,
  status: string,
  project_id: number,
  role: string,
  applicant_name: string
) => {
  try {
    const client = await pool.connect();
    const query = {
      text: `
        INSERT INTO project_applications (user_id, applicant_name, project_id, role, status, applied_on)
        VALUES ($1, $2, $3, $4, $5, $6)
      `,
      values: [
        user_id,
        applicant_name,
        project_id,
        role,
        status,
        new Date().toLocaleString(),
      ],
    };
    await client.query(query);
    client.release();
  } catch (error: any) {
    console.error("Error adding application in database:", error.message);
    throw new Error("Error adding application in database");
  }
};

export const deleteApplication = async (
  project_id: number,
  role_name: string,
  applicant_id: number
) => {
  try {
    const client = await pool.connect();
    const query = {
      text: `
        DELETE FROM project_applications
        WHERE project_id = $1 AND user_id = $2 AND role = $3
      `,
      values: [project_id, applicant_id, role_name],
    };
    await client.query(query);
    client.release();
  } catch (error: any) {
    console.error("Error deleting application in database:", error.message);
    throw new Error("Error deleting application in database");
  }
};

export const changeRole = async (
  user_id: number,
  project_id: number,
  role: string,
  newRole: string
) => {
  try {
    const client = await pool.connect();
    const query = {
      text: `
        UPDATE project_applications
        SET role = $1
        WHERE project_id = $2 AND user_id = $3 AND role = $4
      `,
      values: [newRole, project_id, user_id, role],
    };
    await client.query(query);
    client.release();
  } catch (error: any) {
    console.error("Error changing role in database:", error.message);
    throw new Error("Error changing role in database");
  }
};

export const getApplicants = async (project_id: number) => {
  try {
    const client = await pool.connect();
    const query = {
      text: "SELECT * FROM project_applications WHERE project_id = $1",
      values: [project_id],
    };
    const result = await client.query(query);
    client.release();
    return result.rows;
  } catch (error: any) {
    console.error("Error getting applicants in database:", error.message);
    throw new Error("Error getting applicants in database");
  }
};
