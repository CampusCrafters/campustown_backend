import { pool, createUsersTable, createUserProjectsTable, createUserExperienceTable } from "./tables";

export const addUser = async (name: string, email: string, rollnumber: string, batch: number, branch: string): Promise<void> => {
  let client;
  try {
    client = await pool.connect();
    await createUsersTable(); 

    await client.query("BEGIN");
    // Insert user data into the users table
    await client.query(
      "INSERT INTO users (name, email, rollnumber, batch, branch) VALUES ($1, $2, $3, $4, $5)",
      [name, email, rollnumber, batch, branch]
    );
    await client.query("COMMIT");

    await createUserProjectsTable(); 
    await createUserExperienceTable(); 
  } catch (error) {
    if (client) {
      await client.query("ROLLBACK");
    }
    console.error('Error adding user:', error);
    throw new Error('Error adding user');
  } finally {
    if (client) {
      client.release();
    }
  }
};

export const getUserProfile = async (email: string) => {
  let client;
  try {
    client = await pool.connect();
    const query = {
      text: "SELECT * FROM users WHERE email = $1",
      values: [email],
    };
    const result = await client.query(query);
    client.release();
    return result.rows[0];
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw new Error('Error getting user profile');
  }
}

export const updateUserProfile = async (email: string, updatedInfo: any): Promise<void> => {
  let client;
  try {
    client = await pool.connect();
    await client.query("BEGIN");

    const fields = Object.keys(updatedInfo);

    // Construct the SQL query with placeholders for each field
    const query = `UPDATE users SET ${fields.map((field, index) => `${field} = $${index + 1}`).join(', ')} WHERE email = $${fields.length + 1}`;
    
    // Extract values from the updatedInfo object
    const values = [...Object.values(updatedInfo), email];

    // Execute the SQL query
    await client.query(query, values);

    await client.query("COMMIT");
  } catch (error) {
    if (client) {
      await client.query("ROLLBACK");
    }
    console.error("Error updating user profile:", error);
    throw new Error('Error updating user profile');
  } finally {
    if (client) {
      client.release();
    }
  }
};

export const addMyProject = async (userId: number, projectInfo: object): Promise<void> => {
  let client;
  try {
    client = await pool.connect();
    await client.query("BEGIN");

    const query = {
      text: "INSERT INTO user_projects (user_id, project_title, in_progress, domain, description, project_link, github_link, features, tech_stack, \"group\", team_members, campus_project, collaborators) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)",
      values: [userId, ...Object.values(projectInfo)],
    };

    await client.query(query);
    await client.query("COMMIT");
  } catch (error) {
    if (client) {
      await client.query("ROLLBACK");
    }
    console.error("Error adding project:", error);
    throw new Error('Error adding project');
  } finally {
    if (client) {
      client.release();
    }
  }
}

export const checkEmailExists = async (Email: any) => {
  let client;
  try {
    client = await pool.connect();
    await createUsersTable();
    const query = {
      text: "SELECT EXISTS (SELECT 1 FROM users WHERE email = $1)",
      values: [Email],
    };
    const result = await client.query(query);
    client.release();
    return result.rows[0].exists; // Returns true or false
  } catch (error) {
    console.error("Error checking email existence:", error);
    throw new Error('Error checking email existence');
  }
};
