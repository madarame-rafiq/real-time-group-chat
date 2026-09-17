import bcrypt from 'bcrypt';
import { createUser } from '../repositories/user.repository.js';

export const registerUser = async (username, password) => {
    const password_hash = await bcrypt.hash(password, 12);

    const user = await createUser(username, password_hash);

    return user;
}

