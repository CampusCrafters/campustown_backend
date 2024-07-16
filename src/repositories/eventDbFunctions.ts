import { pool } from "./tables";

export const getAllEvents = async () => {
  try {
    const query = `
        SELECT * FROM events
        `;
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error("Error getting all events:", error);
    throw error;
  }
};

export const getMyEvents = async (user_id: number) => {
  try {
    const query = `
        SELECT * FROM events WHERE host_id = $1
        `;
    const result = await pool.query(query, [user_id]);
    return result.rows;
  } catch (error) {
    console.error("Error getting my events:", error);
    throw error;
  }
};

export const getEvent = async (id: number) => {
  try {
    const query = `
        SELECT * FROM events WHERE event_id = $1
        `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  } catch (error) {
    console.error("Error getting event:", error);
    throw error;
  }
};

export const createEvent = async (eventInfo: any, user_id: number) => {
  try {
    const query = `
        INSERT INTO events (host_id, event_title, description, start_date, end_date, link, posted_on)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        `;
    await pool.query(query, [
      user_id,
      eventInfo.event_title,
      eventInfo.description,
      eventInfo.start_date,
      eventInfo.end_date,
      eventInfo.link,
      new Date(),
    ]);
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
};

export const updateEvent = async (event_id: number, updatedEventInfo: any) => {
  try {
    const query = `
        UPDATE events SET event_title = $1, description = $2, start_date = $3, end_date = $4, link = $5, edited_on = $6
        WHERE event_id = $7
        `;
    await pool.query(query, [
      updatedEventInfo.event_title,
      updatedEventInfo.description,
      updatedEventInfo.start_date,
      updatedEventInfo.end_date,
      updatedEventInfo.link,
      new Date(),
      event_id,
    ]);
  } catch (error) {
    console.error("Error updating event:", error);
    throw error;
  }
};

export const deleteEvent = async (event_id: number) => {
  try {
    const query = `
        DELETE FROM events WHERE event_id = $1
        `;
    await pool.query(query, [event_id]);
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
};

export const registerEvent = async (user_id: number, event_id: number) => {
  try {
    const query = `
        INSERT INTO event_registrations (user_id, event_id)
        VALUES ($1, $2)
        `;
    await pool.query(query, [user_id, event_id]);
  } catch (error) {
    console.error("Error registering event:", error);
    throw error;
  }
};

export const checkEventOwner = async (user_id: number, event_id: number) => {
  try {
    const query = `
        SELECT * FROM events WHERE host_id = $1 AND event_id = $2
        `;
    const result = await pool.query(query, [user_id, event_id]);
    return result.rows.length > 0;
  } catch (error) {
    console.error("Error checking event owner:", error);
    throw error;
  }
};
