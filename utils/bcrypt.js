import bcrypt from 'bcrypt';

export const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10)
};

export const comparePasswords = async (raw, hashed) => {
    return await bcrypt.compare(raw, hashed)
};