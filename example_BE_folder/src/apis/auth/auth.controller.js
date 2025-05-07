import AuthService from './auth.services.js';
import UserModel from '../../models/user.model.js';
import { generateResetToken, verifyResetToken } from '../../utils/token.utils.js';  // Hàm tạo token
import { sendResetPasswordEmail } from '../../services/mail.service.js';  // Dịch vụ gửi email
import bcrypt from 'bcrypt';
class AuthController {
    async register(req, res) {
        try {
            const result = await AuthService.register(req.body);
            res.status(201).json({ success: true, user: result });
        } catch (err) {
            res.status(400).json({ success: false, message: err.message });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const { token, user } = await AuthService.login(email, password);
            res.status(200).json({ success: true, token, user });
        } catch (err) {
            res.status(401).json({ success: false, message: err.message });
        }
    }

    async forgotPassword(req, res) {
        const { email } = req.body;

        try {
            const user = await UserModel.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Tạo token để gửi email
            const resetToken = generateResetToken(user._id);

            // Lưu token và thời gian hết hạn vào DB
            user.resetToken = resetToken;
            user.resetTokenExpiration = Date.now() + 3600000; // Token hết hạn sau 1 giờ
            await user.save();

            // Gửi email với token
            await sendResetPasswordEmail(user.email, resetToken);

            return res.status(200).json({ message: 'Password reset link đã được gửi tới email của bạn' });

        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Server error' });
        }
    }

    // Quá trình đặt lại mật khẩu
    async resetPassword(req, res) {
        const { token, newPassword } = req.body;

        try {
            const decoded = verifyResetToken(token);
            if (!decoded) {
                return res.status(400).json({ message: 'Invalid or expired token' });
            }

            const user = await UserModel.findById(decoded.userId);
            if (!user || user.resetToken !== token || user.resetTokenExpiration < Date.now()) {
                return res.status(400).json({ message: 'Invalid or expired token' });
            }

            // Cập nhật mật khẩu mới
            user.password = await bcrypt.hash(newPassword, 10)
            user.resetToken = undefined;  // Xóa token sau khi đã thay đổi mật khẩu
            user.resetTokenExpiration = undefined;
            await user.save();

            return res.status(200).json({ message: 'Mật khẩu đã được thay đổi thành công' });

        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Server error' });
        }
    }

    async uploadAvatar(req, res) {
        try {
            const file = req.file;
            const userId = req.params.id;

            if (!file) {
                return res.status(400).json({ message: 'Không có ảnh nào được tải lên' });
            }

            const imageUrl = file.path; // URL do Cloudinary trả về thông qua multer-storage-cloudinary
            const updatedUser = await AuthService.updateAvatar(userId, imageUrl);

            res.status(200).json({
                message: 'Tải ảnh đại diện thành công',
                avatarUrl: updatedUser.avatarUrl,
                user: updatedUser
            });

        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Upload thất bại', error: err.message });
        }
    }
}

export default new AuthController();
