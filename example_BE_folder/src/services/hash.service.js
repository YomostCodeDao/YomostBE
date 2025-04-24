import bcrypt from 'bcrypt';

export const hashPassword = async (plainPassword) => {
    return await bcrypt.hash(plainPassword, 10);
};

export const comparePassword = async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
};
