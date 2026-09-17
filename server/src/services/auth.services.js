import bcrypt from 'bcrypt';
import { createUser, findUserNameByusername } from '../repositories/user.repository.js';
import { createSession } from '../repositories/session.repositories.js';

export const registerUser = async (username, password) => {
    const password_hash = await bcrypt.hash(password, 12);

    const user = await createUser(username, password_hash);

    return user;
}


export const loginUser = async (username, password) => {
    const user = await findUserNameByusername(username);

    if (!user) {
        throw new Error('Wrong username or password');
    }

    const comparePassword = await bcrypt.compare(password, user.password_hash);

    if (!comparePassword) {
        throw new Error('Wrong username or password');
    }

    const expires_at = new Date(
        Date.now() + 1000 * 60 * 60 * 24 * 7
    );

    const session = await createSession(user.id, expires_at);

    return {
        user: {
            username: user.username,
            id: user.id,
            createdAt: user.created_at
        },
        session
    };
}