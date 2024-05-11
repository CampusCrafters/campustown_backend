import { Pool } from "pg";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function createUsersTable(): Promise<void> {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        user_id SERIAL PRIMARY KEY,
        profile_picture VARCHAR(255) DEFAULT NULL,
        resume BYTEA DEFAULT NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        rollnumber VARCHAR(20) NOT NULL UNIQUE,
        batch INTEGER NOT NULL,
        branch VARCHAR(255) NOT NULL,
        dob DATE,
        location VARCHAR(255),
        pers_email VARCHAR(255),
        mobile CHAR(10) CHECK (mobile ~ '^[0-9]{10}$') UNIQUE,
        about TEXT,
        github VARCHAR(255) UNIQUE,
        linkedin VARCHAR(255) UNIQUE,
        skills TEXT[],
        interests TEXT[],
        learning TEXT[]
      )
    `);
    console.log('Table "users" successfully created or already exists');
  } catch (error) {
    console.error("Error creating users table:", error);
    throw error;
  }
}

export async function createUserProjectsTable(): Promise<void> {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS user_projects (
        user_project_id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
        project_title VARCHAR(255),
        in_progress BOOLEAN,
        domain VARCHAR(255),
        description TEXT,
        project_link VARCHAR(255),
        github_link VARCHAR(255),
        features TEXT[],
        tech_stack TEXT[],
        "group" BOOLEAN,
        team_members TEXT[],
        campus_project BOOLEAN,
        collaborators TEXT[]
      )
    `;
    await pool.query(query);
    console.log('Table "user_projects" successfully created or already exists');
  } catch (error) {
    console.error("Error creating user_projects table:", error);
    throw error;
  }
}

export async function createUserExperienceTable(): Promise<void> {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS user_experience (
        exp_id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
        role VARCHAR(255) NOT NULL,
        role_type VARCHAR(255) NOT NULL,
        organization VARCHAR(255) NOT NULL,
        organization_type VARCHAR(255) NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL, 
        tech_stack TEXT[] NOT NULL,
        contributions TEXT[] NOT NULL
      )
    `;
    await pool.query(query);
    console.log(
      'Table "user_experience" successfully created or already exists'
    );
  } catch (error) {
    console.error("Error creating user_experience table:", error);
    throw error;
  }
}

export async function createProjectsTable(): Promise<void> {
  try {
    const query = `
    CREATE TABLE IF NOT EXISTS projects (
      project_id SERIAL PRIMARY KEY,
      host_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE NOT NULL,
      members JSONB DEFAULT '[]'::jsonb, 
      project_title VARCHAR(255) NOT NULL,
      domain VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      link VARCHAR(255) DEFAULT NULL,
      required_roles TEXT[] NOT NULL DEFAULT '{}', 
      posted_on TIMESTAMP NOT NULL,
      start_date DATE NOT NULL,
      end_date DATE DEFAULT NULL,
      status VARCHAR(50) DEFAULT 'Open' NOT NULL,
      edited_on TIMESTAMP DEFAULT NULL
  );
    `;
    await pool.query(query);
    console.log('Table "Projects" successfully created or already exists');
  } catch (error) {
    console.error(`Error creating Projects table: ${error}`);
  }
}

export const createProjectApplicationsTable = async (): Promise<void> => {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS project_applications (
        application_id SERIAL PRIMARY KEY ,
        user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
        applicant_name VARCHAR(255) NOT NULL, 
        project_id INTEGER REFERENCES projects(project_id) ON DELETE CASCADE,
        role VARCHAR(255) NOT NULL, 
        status VARCHAR(50) DEFAULT 'Pending' NOT NULL
      )
    `;
    await pool.query(query);
    console.log(
      'Table "ProjectApplications" successfully created or already exists'
    );
  } catch (error) {
    console.error("Error creating ProjectApplications table:", error);
    throw error;
  }
};
