import pool from '../db/pool.js';

export const createSession = async (userId, expires_at) => {
    const query = `
        INSERT INTO sessions (user_id, expires_at)
        VALUES ($1, $2)
        RETURNING id, user_id, created_at, expires_at;
    `;
    const result = await pool.query(query, [userId, expires_at]);

    return result.rows[0];
};

export const findSessionWithUser = async (sessionId) => {
    const query = `
        SELECT
            sessions.id AS session_id,
            sessions.expires_at,
            users.id AS user_id,
            users.username
        FROM sessions
        INNER JOIN users
            ON users.id = sessions.user_id
        WHERE sessions.id = $1
          AND sessions.expires_at > NOW();
    `;
    const result = await pool.query(query, [sessionId]);
    return result.rows[0];
};

export const deleteSession = async (sessionId) => {
    const query = `
        DELETE FROM sessions
        WHERE id = $1;
    `;
    await pool.query(query, [sessionId]);
}