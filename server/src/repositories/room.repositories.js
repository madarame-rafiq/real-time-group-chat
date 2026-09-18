import pool from '../db/pool.js'

// export const createRoom = async (code, name, userId) => {
//     const query = `
//         INSERT INTO rooms (code, name, created_by)
//         VALUES ($1, $2, $3)
//         RETURNING id, code, name, created_by, created_at;
//     `;

//     const result = await pool.query(query, [code, name, userId]);
//     return result.rows[0];
// }

// export const addRoomMember = async (roomId, userId) => {

//     const query = `
//         INSERT INTO room_members (room_id, user_id)
//         VALUES ($1, $2)
//         RETURNING room_id, user_id, joined_at;
//     `;
//     const result = await pool.query(query, [roomId, userId]);
//     return result.rows[0];
// }

export const createNewRoomWithMember = async (code, name, userId) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        const roomResult = await client.query(`
                INSERT INTO rooms (code, name, created_by)
                VALUES ($1, $2, $3)
                RETURNING id, code, name, created_by;
            `, [code, name, userId]);

        const room = roomResult.rows[0];

        await client.query(`
                INSERT INTO room_members (room_id, user_id)
                VALUES ($1, $2)
                RETURNING room_id, user_id, joined_at;
            `, [room.id, userId]);

        await client.query("COMMIT");
        return room;

    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}