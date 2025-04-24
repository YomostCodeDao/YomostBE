import { UserRepository } from '../../repositories/user.repository.js';
import { hashPassword, comparePassword } from '../../services/hash.service.js';
import jwt from 'jsonwebtoken';

const userRepo = new UserRepository();

class AuthService {
    async register(userDTO) {
        const hashed = await hashPassword(userDTO.password);
        return await userRepo.create({
            name: userDTO.name,
            email: userDTO.email,
            password: hashed
        });
    }

    async login(email, password) {
        const users = await userRepo.getAll();
        const user = await userRepo.getByEmail(email);
        if (!user) throw new Error('User not found');

        const isValid = await comparePassword(password, user.password);
        if (!isValid) throw new Error('Invalid credentials');

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });

        return { token, user };
    }
}

export default new AuthService();
