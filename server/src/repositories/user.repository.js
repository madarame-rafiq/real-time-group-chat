import pool from '../db/pool.js'

export const createUser = async (username, password_hash) => {
    const query = `
        INSERT INTO users (username, password_hash)
        VALUES ($1, $2)
        RETURNING id, username, created_at;
    `
    const values = [username, password_hash];
    const result = await pool.query(query, values);

    return result.rows[0];
}

export const findUserNameByusername = async (username) => {
    const query = `
        SELECT id, username, password_hash, created_at
        FROM users
        WHERE username = $1; 
    `;

    const result = await pool.query(query, [username]);

    return result.rows[0] || null;
}