import { pool } from "./tables";

export const getAllProjects = async () => {
  try {
    const client = await pool.connect();
    const query = {
      text: "SELECT projects.*, users.name, users.profile_picture FROM projects INNER JOIN users ON projects.host_id = users.user_id",
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
        "INSERT INTO projects (host_id, project_title, description, domain, link, required_roles, start_date, end_date, status, posted_on)" +
        "VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
      values: [
        user_id,
        projectInfo.project_title,
        projectInfo.description,
        projectInfo.domain,
        projectInfo.link,
        projectInfo.required_roles,
        projectInfo.start_date,
        projectInfo.end_date,
        projectInfo.status,
        new Date().toISOString(),
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

export const getProject = async (project_id: number) => {
  console.log("getProject");
  try {
    const client = await pool.connect();
    const query = {
      text: "SELECT * FROM projects WHERE project_id = $1",
      values: [project_id],
    };
    const result = await client.query(query);
    client.release();
    return result.rows[0];
  } catch (err: any) {
    console.error("Error getting project: ", err.message);
    throw new Error("Error getting project");
  }
};

export const updateProject = async (project_id: number, projectInfo: any) => {
  console.log("projectInfo", projectInfo);
  try {
    // Access nested projectInfo
    const {
      project_title,
      description,
      domain,
      link,
      required_roles,
      start_date,
      end_date,
      status,
    } = projectInfo.projectInfo;

    const client = await pool.connect();
    const query = {
      text:
        "UPDATE projects SET project_title = $1, description = $2, domain = $3, link = $4, required_roles = $5, start_date = $6, end_date = $7, status = $8, posted_on = $9 " +
        "WHERE project_id = $10",
      values: [
        project_title || "",
        description || "",
        domain || "",
        link || "",
        required_roles || [],
        start_date,
        end_date,
        status || "",
        new Date().toISOString(),
        project_id,
      ],
    };

    await client.query(query);
    client.release();
  } catch (err: any) {
    console.error("Error updating project: ", err.message);
    throw new Error("Error updating project: " + err.message);
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
        SET status = $4, reviewed_on = $5
        WHERE project_id = $1 AND user_id = $2 AND role_name = $3
      `,
      values: [
        project_id,
        applicant_id,
        role_name,
        "Accepted", // Assuming status is of type string
        new Date().toISOString(),
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
        SET status = $4, reviewed_on = $5
        WHERE project_id = $1 AND user_id = $2 AND role_name = $3
      `,
      values: [
        project_id,
        applicant_id,
        role_name,
        "Shortlisted",
        new Date().toISOString(), // Using toISOString() for standard datetime format
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
  console.log(project_id, role_name, applicant_id);
  try {
    const client = await pool.connect();
    const updateProjectApplicationsTable = {
      text: `
        UPDATE project_applications 
        SET status = $4, reviewed_on = $5
        WHERE project_id = $1 AND user_id = $2 AND role_name = $3
      `,
      values: [
        project_id,
        applicant_id,
        role_name,
        "Rejected",
        new Date().toISOString(), // Use ISO string format for the date
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
    if (await checkApplicationExistsById(user_id, project_id, role)) {
      throw new Error("Application already exists");
    }
    if (!(await checkRoleExists(project_id, role))) {
      throw new Error("Role does not exist in the project");
    }
    const query = {
      text: `
        INSERT INTO project_applications (user_id, applicant_name, project_id, role_name, status, applied_on)
        VALUES ($1, $2, $3, $4, $5, $6)
      `,
      values: [
        user_id,
        applicant_name,
        project_id,
        role,
        status,
        new Date().toISOString(),
      ],
    };
    await client.query(query);
    client.release();
  } catch (error: any) {
    console.error("Error adding application in database:", error.message);
    throw new Error("Error adding application in database");
  }
};

export const checkApplicationExistsById = async (
  user_id: number,
  project_id: number,
  role_name: string
) => {
  try {
    const client = await pool.connect();
    const query = {
      text: `
        SELECT EXISTS (
          SELECT 1
          FROM project_applications
          WHERE user_id = $1 AND project_id = $2 AND role_name = $3
        )
      `,
      values: [user_id, project_id, role_name],
    };
    const result = await client.query(query);
    client.release();
    return result.rows[0].exists;
  } catch (error: any) {
    console.error("Error checking application in database:", error.message);
    throw new Error("Error checking application in database");
  }
};

export const deleteApplication = async (application_id: number) => {
  try {
    const client = await pool.connect();
    const query = {
      text: "DELETE FROM project_applications WHERE application_id = $1",
      values: [application_id],
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
        SET role_name = $1
        WHERE project_id = $2 AND user_id = $3 AND role_name = $4
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
  console.log("Type of project_id:", typeof project_id, "Value:", project_id);
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

export const checkApplicationExists = async (
  user_id: number,
  project_id: number,
  role: string
) => {
  try {
    const client = await pool.connect();
    const query = {
      text: `
        SELECT EXISTS (
          SELECT 1
          FROM project_applications
          WHERE user_id = $1 AND project_id = $2 AND role_name = $3
        )
      `,
      values: [user_id, project_id, role],
    };
    const result = await client.query(query);
    client.release();
    return result.rows[0].exists;
  } catch (error: any) {
    console.error("Error checking application in database:", error.message);
    throw new Error("Error checking application in database");
  }
};

export const checkApplicationIdExists = async (application_id: number) => {
  try {
    const client = await pool.connect();
    const query = {
      text: `
        SELECT EXISTS (
          SELECT 1
          FROM project_applications
          WHERE application_id = $1
        )
      `,
      values: [application_id],
    };
    const result = await client.query(query);
    client.release();
    return result.rows[0].exists;
  } catch (error: any) {
    console.error("Error checking application id in database:", error.message);
    throw new Error("Error checking application id in database");
  }
};

export const verifyApplicationOwner = async (
  user_id: number,
  application_id: number
) => {
  try {
    const client = await pool.connect();
    const query = {
      text: `
        SELECT EXISTS (
          SELECT 1
          FROM project_applications
          WHERE user_id = $1 AND application_id = $2
        )
      `,
      values: [user_id, application_id],
    };
    const result = await client.query(query);
    client.release();
    return result.rows[0].exists;
  } catch (error: any) {
    console.error(
      "Error verifying application owner in database:",
      error.message
    );
    throw new Error("Error verifying application owner in database");
  }
};

export const checkRoleExists = async (project_id: number, role: string) => {
  try {
    const client = await pool.connect();
    const query = {
      text: `
        SELECT EXISTS (
          SELECT 1
          FROM projects
          WHERE project_id = $1 AND $2 = ANY(required_roles)
        )
      `,
      values: [project_id, role],
    };
    const result = await client.query(query);
    client.release();
    return result.rows[0].exists;
  } catch (error: any) {
    console.error("Error checking role in database:", error.message);
    throw new Error("Error checking role in database");
  }
};

//get applicant name with user_id
export const getApplicantName = async (user_id: number) => {
  try {
    const client = await pool.connect();
    const query = {
      text: "SELECT name FROM users WHERE user_id = $1",
      values: [user_id],
    };
    const result = await client.query(query);
    client.release();
    return result.rows[0].name;
  } catch (error: any) {
    console.error("Error getting applicant name in database:", error.message);
    throw new Error("Error getting applicant name in database");
  }
};
