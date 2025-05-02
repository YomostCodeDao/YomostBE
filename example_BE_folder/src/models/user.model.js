import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    resetToken: { type: String, default: null }, //Thêm trường résetToken để lưu thông tin token
    resetTokenTime: { type: Date } //Thêm trường resetTokenTime để lưu thời gian hết hạn của token

});

const UserModel = mongoose.model('User', userSchema);

export default UserModel;