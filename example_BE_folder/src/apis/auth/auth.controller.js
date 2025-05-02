import AuthService from './auth.services.js';
import UserModel from '../../models/user.model.js';
import { generateResetToken, verifyResetToken } from '../../utils/token.utils.js';  // Hàm tạo token
import { sendResetPasswordEmail } from '../../services/mail.service.js';  // Dịch vụ gửi email
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
            user.password = newPassword;
            user.resetToken = undefined;  // Xóa token sau khi đã thay đổi mật khẩu
            user.resetTokenExpiration = undefined;
            await user.save();

            return res.status(200).json({ message: 'Password has been reset successfully' });

        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Server error' });
        }
    }
}

export default new AuthController();
