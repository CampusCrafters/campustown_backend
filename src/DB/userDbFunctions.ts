import { pool } from "./tables";

export const getAllUsers = async () => {
  try {
    const client = await pool.connect();
    const query = "SELECT user_id, profile_picture, name FROM users";
    const result = await client.query(query);
    const users = result.rows;
    client.release();
    return users;
  } catch (error) {
    console.error("Error getting all users from database:", error);
    throw new Error("Error getting all users from database");
  }
}

export const addUser = async (
  name: string,
  email: string,
  rollnumber: string,
  batch: number,
  branch: string
): Promise<void> => {
  try {
    const client = await pool.connect();
    const query = `INSERT INTO users (name, email, rollnumber, batch, branch) VALUES ($1, $2, $3, $4, $5)`;
    const values = [name, email, rollnumber, batch, branch];
    await client.query(query, values);
    client.release();
  } catch (error) {
    console.error("Error adding user to database:", error);
    throw new Error("Error adding user to database");
  }
};

export const getUserProfile = async (email: string) => {
  try {
    const client = await pool.connect();
    const query = "SELECT * FROM users WHERE email = $1";
    const values = [email];
    const result = await client.query(query, values);
    const user = result.rows[0];
    client.release();
    return user || `No user found with email ${email}`;
  } catch (error) {
    console.error("Error getting user profile from database:", error);
    throw new Error("Error getting user profile from database");
  }
};

export const getUserProfileById = async (user_id: number) => {
  try {
    const client = await pool.connect();
    const query = "SELECT * FROM users WHERE user_id = $1";
    const values = [user_id];
    const result = await client.query(query, values);
    const user = result.rows[0];
    client.release();
    return user || `No user found with id ${user_id}`;
  } catch (error) {
    console.error("Error getting user profile from database:", error);
    throw new Error("Error getting user profile from database");
  }
}

export const setProfilePicture = async (
  user_id: number,
  imageUrl: string | null
): Promise<void> => {
  try {
    const client = await pool.connect();
    let query, values;
    if (imageUrl !== null) {
      query = `UPDATE users SET profile_picture = $1 WHERE user_id = $2`;
      values = [imageUrl, user_id];
    } else {
      query = `UPDATE users SET profile_picture = NULL WHERE user_id = $1`;
      values = [user_id];
    }
    await client.query(query, values);
    client.release();
  } catch (error) {
    console.error("Error setting profile picture in database:", error);
    throw new Error("Error setting profile picture in database");
  }
};

export const getProfilePicture = async (user_id: number) => {
  try {
    const client = await pool.connect();
    const query = "SELECT profile_picture FROM users WHERE user_id = $1";
    const values = [user_id];
    const result = await client.query(query, values);
    const profilePicture = result.rows[0];
    client.release();
    return profilePicture || null;
  } catch (error) {
    console.error("Error getting profile picture from database:", error);
    throw new Error("Error getting profile picture from database");
  }
};

export const updateUserProfile = async (
  email: string,
  updatedInfo: any
): Promise<void> => {
  try {
    const client = await pool.connect();
    const fields = Object.keys(updatedInfo);

    const query = `UPDATE users SET ${fields
      .map((field, index) => `${field} = $${index + 1}`)
      .join(", ")} WHERE email = $${fields.length + 1}`;
    const values = [...Object.values(updatedInfo), email];
    await client.query(query, values);
    client.release();
  } catch (error) {
    console.error("Error updating user profile on database:", error);
    throw new Error("Error updating user profile on database");
  }
};

export async function addProfileProject(
  userId: number,
  projectInfo: object
): Promise<void> {
  try {
    const client = await pool.connect();
    const query = `
      INSERT INTO user_projects (user_id, project_title, in_progress, domain, description, project_link, github_link, features, tech_stack, "group", team_members, campus_project, collaborators)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    `;
    const values = [userId, ...Object.values(projectInfo)];
    await client.query(query, values);
    client.release();
  } catch (error) {
    console.error("Error adding project to database:", error);
    throw new Error("Error adding project to database");
  }
}

export const getProfileProject = async (userId: number) => {
  try {
    const client = await pool.connect();
    const query = `SELECT * FROM user_projects WHERE user_id = $1`;
    const values = [userId];
    const result = await client.query(query, values);
    const profileProject = result.rows;
    client.release();
    return profileProject || `No projects found for user with id ${userId}`;
  } catch (error) {
    console.error("Error getting profile projects from database:", error);
    throw new Error("Error getting profile projects from database");
  }
};

export const editProfileProject = async (
  user_project_id: number,
  projectInfo: object
) => {
  try {
    const client = await pool.connect();
    const fields = Object.keys(projectInfo);
    const query =
      `UPDATE user_projects SET ${fields
        .map((field, index) => {
          // If the field is "group", enclose it in double quotes as group is a reserve keyword in postres
          const fieldName = field === "group" ? `"${field}"` : field;
          return `${fieldName} = $${index + 1}`;
        })
        .join(", ")}` + ` WHERE user_project_id = $${fields.length + 1}`;

    const values = [...Object.values(projectInfo), user_project_id];
    await client.query(query, values);
    client.release();
  } catch (error) {
    console.error("Error updating project on database:", error);
    throw new Error("Error updating project on database");
  }
};

export const deleteProfileProject = async (user_project_id: number) => {
  try {
    const client = await pool.connect();
    const query = "DELETE FROM user_projects WHERE user_project_id = $1";
    const values = [user_project_id];
    await client.query(query, values);
    client.release();
  } catch (error) {
    console.error("Error deleting project from database:", error);
    throw new Error("Error deleting project from database");
  }
};

export const getProfileExperience = async (userId: number) => {
  try {
    const client = await pool.connect();
    const query = `SELECT * FROM user_experience WHERE user_id = $1`;
    const values = [userId];
    const result = await client.query(query, values);
    const profileExperience = result.rows;
    client.release();
    return (
      profileExperience || `No experience found for user with id ${userId}`
    );
  } catch (error) {
    console.error("Error getting profile experience from database:", error);
    throw new Error("Error getting profile experience from database");
  }
};

export const addProfileExperience = async (
  userId: number,
  experienceInfo: object
) => {
  try {
    const client = await pool.connect();
    const query = `
      INSERT INTO user_experience (user_id, role, role_type, organization, organization_type, start_date, end_date, tech_stack, contributions)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `;
    const values = [userId, ...Object.values(experienceInfo)];
    await client.query(query, values);
    client.release();
  } catch (error) {
    console.error("Error adding experience to database:", error);
    throw new Error("Error adding experience to database");
  }
};

export const editProfileExperience = async (
  user_experience_id: number,
  experienceInfo: object
) => {
  try {
    const client = await pool.connect();
    const fields = Object.keys(experienceInfo);
    const query = `UPDATE user_experience SET ${fields
      .map((field, index) => `${field} = $${index + 1}`)
      .join(", ")} WHERE exp_id = $${fields.length + 1}`;
    const values = [...Object.values(experienceInfo), user_experience_id];
    await client.query(query, values);
    client.release();
  } catch (error) {
    console.error("Error updating experience on database:", error);
    throw new Error("Error updating experience on database");
  }
};

export const deleteProfileExperience = async (user_experience_id: number) => {
  try {
    const client = await pool.connect();
    const query = "DELETE FROM user_experience WHERE exp_id = $1";
    const values = [user_experience_id];
    await client.query(query, values);
    client.release();
  } catch (error) {
    console.error("Error deleting experience from database:", error);
    throw new Error("Error deleting experience from database");
  }
};

export const checkProfileExperienceOwner = async (
  userId: number,
  user_experience_id: number
) => {
  try {
    const client = await pool.connect();
    const query =
      "SELECT EXISTS (SELECT 1 FROM user_experience WHERE user_id = $1 AND exp_id = $2)";
    const values = [userId, user_experience_id];
    const result = await client.query(query, values);
    client.release();
    return result.rows[0].exists;
  } catch (error) {
    console.error("Error checking experience owner in database:", error);
    throw new Error("Error checking experience owner in database");
  }
};

export const getMyApplications = async (userId: number) => {
  try {
    const client = await pool.connect();
    const query = `
      SELECT pa.*, p.project_title
      FROM project_applications pa
      JOIN projects p ON pa.project_id = p.project_id
      WHERE pa.user_id = $1
    `;
    const values = [userId];
    const result = await client.query(query, values);
    const myApplications = result.rows;
    client.release();
    return myApplications || `No applications found for user with id ${userId}`;
  } catch (error: any) {
    console.error("Error getting applications from database:", error.message);
    throw new Error("Error getting applications from database");
  }
};

export const checkProfileProjectOwner = async (
  userId: number,
  user_project_id: number
) => {
  try {
    const client = await pool.connect();
    const query =
      "SELECT EXISTS (SELECT 1 FROM user_projects WHERE user_id = $1 AND user_project_id = $2)";
    const values = [userId, user_project_id];
    const result = await client.query(query, values);
    client.release();
    return result.rows[0].exists;
  } catch (error) {
    console.error("Error checking project owner in database:", error);
    throw new Error("Error checking project owner in database");
  }
};

export const checkEmailExists = async (email: string) => {
  try {
    const client = await pool.connect();
    const queryString = "SELECT EXISTS (SELECT 1 FROM users WHERE email = $1)";
    const values = [email];
    const result = await client.query(queryString, values);
    client.release();
    return result.rows[0].exists;
  } catch (error) {
    console.error("Error checking email existence in database:", error);
    throw new Error("Error checking email existence in database");
  }
};

export const addProfileResume = async (user_id: number, fileData: Buffer) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const removeresume = "UPDATE users SET resume = NULL WHERE user_id=$1";
    await client.query(removeresume, [user_id]);
    const query = "UPDATE users SET resume = $1 WHERE user_id = $2";
    const values = [fileData, user_id];
    await client.query(query, values);
    await client.query("COMMIT");
  } catch (err: any) {
    await client.query("ROLLBACK");
    console.error("Error uploading resume in database: ", err.message);
    throw new Error("Error uploading resume in database");
  } finally {
    client.release();
  }
};

export const viewProfileResume = async (user_id: number) => {
  try {
    const client = await pool.connect();
    //const query = "SELECT resume::bytea as resume FROM users WHERE user_id= $1";
    const query =
      "SELECT encode(resume::bytea, 'base64') as " +
      "resume" +
      " FROM users WHERE user_id= $1";
    const values = [user_id];
    const result = await client.query(query, values);
    const resumeBuffer = result.rows[0];
    client.release;
    return resumeBuffer || `No resume found with user_id: ${user_id}`;
  } catch (err: any) {
    console.error("Error viewing resume from database: ", err.message);
    throw new Error("Error viewing resume from database");
  }
};

export const deleteProfileResume = async (user_id: number) => {
  try {
    const client = await pool.connect();
    const query = "UPDATE users SET resume = NULL WHERE user_id = $1";
    const values = [user_id];
    await client.query(query, values);
    client.release();
  } catch (err: any) {
    console.error("Error deleting resume from database: ", err.message);
    throw new Error("Error deleting resume from databases");
  }
};
