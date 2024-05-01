import { Pool } from "pg";

export const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

export async function createUsersTable(): Promise<void> {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        user_id SERIAL PRIMARY KEY,
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
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_projects (
        user_project_id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(user_id),
        project_title VARCHAR(255),
        in_progress BOOLEAN,
        domain VARCHAR(255),
        description TEXT,
        project_link VARCHAR(255),
        github_link VARCHAR(255),
        features TEXT[],
        tech_stack TEXT[],
        "group" BOOLEAN, -- "group" column enclosed in double quotes
        team_members TEXT[],
        campus_project BOOLEAN,
        collaborators TEXT[]
      )
    `);
    console.log('Table "user_projects" successfully created or already exists');
  } catch (error) {
    console.error("Error creating user_projects table:", error);
    throw error;
  }
}

export async function createUserExperienceTable(): Promise<void> {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_experience (
        exp_id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(user_id),
        role VARCHAR(255) NOT NULL,
        organization VARCHAR(255) NOT NULL,
        organization_type VARCHAR(255),
        start_date DATE NOT NULL,
        end_date DATE,
        tech_stack TEXT[],
        contributions TEXT[]
      )
    `);
    console.log('Table "user_experience" successfully created or already exists');
  } catch (error) {
    console.error("Error creating user_experience table:", error);
    throw error;
  }
}

