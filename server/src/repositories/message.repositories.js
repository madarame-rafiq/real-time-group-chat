import pool from '../db/pool.js'

export const createMessage = async (roomId, senderId, content) => {
    const query = `
        WITH inserted AS (
            INSERT INTO messages (room_id, sender_id, content)
            VALUES ($1, $2, $3)
            RETURNING id, room_id, sender_id, content, sent_at
        )
        SELECT
            inserted.id,
            inserted.room_id,
            inserted.sender_id,
            users.username AS sender_username,
            inserted.content,
            inserted.sent_at
        FROM inserted
        LEFT JOIN users
            ON users.id = inserted.sender_id;
    `;

    const result = await pool.query(query, [
        roomId,
        senderId,
        content,
    ]);

    return result.rows[0];
}

export const findMessagesByRoomId = async (roomId, limit=50, begin=null) => {
    const query = `
        SELECT
            messages.id,
            messages.room_id,
            messages.sender_id,
            users.username AS sender_username,
            messages.content,
            messages.sent_at
        FROM messages
        LEFT JOIN users
            ON users.id = messages.sender_id
        WHERE messages.room_id = $1
          AND ($2::timestamptz IS NULL OR messages.sent_at < $2)
        ORDER BY messages.sent_at DESC, messages.id DESC
        LIMIT $3;
    `;
    const result = await pool.query(query, [roomId, begin, limit]);

    return result.rows;
}