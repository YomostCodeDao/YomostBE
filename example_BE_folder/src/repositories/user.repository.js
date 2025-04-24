import UserModel from "../models/user.model.js";

export class UserRepository {
    async create(dto) {
        const { name, email, password } = dto;

        const result = await UserModel.create({
            name,
            email,
            password,
        });

        return {
            name,
            email,
            id: String(result._id),
        };
    }

    async getOneById(id) {
        const user = await UserModel.findOne({
            _id: id,
        });

        if (!user) {
            throw new Error('not found');
        }

        return {
            id: String(user._id),
            name: String(user.name),
            email: String(user.email),
        };
    }

    async getAll() {
        const users = await UserModel.find();
        if (!users) throw new Error('Not found user');

        return users.map(user => ({
            id: user._id.toString(),
            name: user.name,
            email: user.email
        }));
    }

    async deleteOneById(id) {
        const deletedUser = await UserModel.findOneAndDelete({ _id: id }).lean();
        if (!deletedUser) throw new Error('not found');

        return {
            id: String(deletedUser._id),
            name: deletedUser.name,
            email: deletedUser.email,
        };
    }

    async getByEmail(email) {
        return await UserModel.findOne({ email });
    }
}