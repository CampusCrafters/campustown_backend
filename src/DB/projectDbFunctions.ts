import { pool } from './tables';

export const postProject = async (user_id: number, projectInfo: any) => {
    try {
        const client = await pool.connect();
        const query = `INSERT INTO projects (host_id, project_title, description, domain, required_roles, start_date, end_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;
        const values = [user_id, projectInfo.project_title, projectInfo.description, projectInfo.domain, projectInfo.required_roles, projectInfo.start_date, projectInfo.end_date];
        await client.query(query, values);
        client.release();
    } catch (error) {
        console.error("Error posting project to database:", error);
        throw new Error('Error posting project to database');
    }
};