import { pool, createUsersTable, createUserProjectsTable, createUserExperienceTable, createUserApplicationsTable, createProjectsTable } from "./tables";

export const addUser = async (name: string, email: string, rollnumber: string, batch: number, branch: string): Promise<void> => {
  try {
    const client = await pool.connect();
    await createUsersTable();
    await createUserProjectsTable();
    await createUserExperienceTable();
    await createProjectsTable();
    await createUserApplicationsTable();

    const query = `INSERT INTO users (name, email, rollnumber, batch, branch) VALUES ($1, $2, $3, $4, $5)`;
    const values = [name, email, rollnumber, batch, branch];
    await client.query(query, values);
    client.release();
  } catch (error) {
    console.error('Error adding user to database:', error);
    throw new Error('Error adding user to database');
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
    throw new Error('Error getting user profile from database');
  }
};

export const updateUserProfile = async (email: string, updatedInfo: any): Promise<void> => {
  try {
    const client = await pool.connect();
    const fields = Object.keys(updatedInfo);

    const query = `UPDATE users SET ${fields.map((field, index) => `${field} = $${index + 1}`).join(', ')} WHERE email = $${fields.length + 1}`;
    const values = [...Object.values(updatedInfo), email];
    await client.query(query, values);
    client.release();
  } catch (error) {
    console.error("Error updating user profile on database:", error);
    throw new Error('Error updating user profile on database');
  } 
};

export async function addProfileProject(userId: number, projectInfo: object): Promise<void> {
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
    throw new Error('Error adding project to database');
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
    throw new Error('Error getting profile projects from database');
  }
}

export const editProfileProject = async (user_project_id: number, projectInfo: object) => {  
  try {
    const client = await pool.connect();
    const fields = Object.keys(projectInfo);
    const query = `UPDATE user_projects SET ${fields
      .map((field, index) => {
        // If the field is "group", enclose it in double quotes as group is a reserve keyword in postres
        const fieldName = field === 'group' ? `"${field}"` : field;
        return `${fieldName} = $${index + 1}`;
      })
      .join(', ')}` + ` WHERE user_project_id = $${fields.length + 1}`;
     
    const values = [...Object.values(projectInfo), user_project_id];
    await client.query(query, values);
    client.release();
  } catch (error) {
    console.error("Error updating project on database:", error);
    throw new Error('Error updating project on database');
  } 
}

export const checkProfileProjectOwner = async (userId: number, user_project_id: number) => {
  try {
    const client = await pool.connect();
    const query = "SELECT EXISTS (SELECT 1 FROM user_projects WHERE user_id = $1 AND user_project_id = $2)";
    const values = [userId, user_project_id];
    const result = await client.query(query, values);
    client.release();
    return result.rows[0].exists;
  } catch (error) {
    console.error("Error checking project owner in database:", error);
    throw new Error('Error checking project owner in database');
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
    throw new Error('Error checking email existence in database');
  }
};