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


export const findRoomByCode = async (code) => {
    const query = `
        SELECT id, name, code, created_at, created_by
        FROM rooms
        WHERE code = $1;
    `;

    const result = await pool.query(query, [code]);

    return result.rows[0] || null;
}

export const findRoomByUserId = async (userId) => {
    const query = `
        SELECT
            rooms.id,
            rooms.name,
            rooms.code,
            rooms.created_by,
            rooms.created_at,
            room_members.joined_at
        FROM room_members
        INNER JOIN rooms
            ON rooms.id = room_members.room_id
        WHERE room_members.user_id = $1
        ORDER BY room_members.joined_at DESC;
    `;

    const result = await pool.query(query, [userId]);
    // console.log(result)

    return result.rows;
}

export const findRoomMember = async (roomId, userId) => {
    const query = `
        SELECT room_id, user_id, joined_at
        FROM room_members
        WHERE room_id = $1 AND user_id = $2;
    `;
    const result = await pool.query(query, [roomId, userId]);
    return result.rows[0] | null;
}

export const addRoomMember = async (roomId, userId) => {
    const query = `
        INSERT INTO room_members (room_id, user_id)
        VALUES ($1, $2)
        RETURNING room_id, user_id, joined_at;
    `;
    const result = pool.query(query, [roomId, userId]);
    // return result.rows[0];
}

export const isRoomMember = async (roomId, userId) => {
    const query = `
        SELECT 1
        FROM room_members
        WHERE room_id = $1 AND user_id = $2;
    `;
    const result = await pool.query(query, [roomId, userId]);

    return result.rowCount > 0;
}

export const removeRoomMember = async (roomId, userId) => {
    const query = `
        DELETE FROM room_members
        WHERE room_id = $1
          AND user_id = $2
        RETURNING room_id, user_id;
    `;

    const result = await pool.query(query, [
        roomId,
        userId,
    ]);

    return result.rows[0] || null;
};