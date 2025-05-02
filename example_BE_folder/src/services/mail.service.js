import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config(); // Đọc file .env

// Tạo kết nối với dịch vụ email (SMTP)
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,  // Máy chủ SMTP để gửi email
    port: process.env.SMTP_PORT,  // Cổng SMTP (587 thường dùng cho gửi qua TLS)
    secure: false,                // Nếu là false thì không sử dụng SSL
    auth: {
        user: process.env.SMTP_USER,  // Lấy từ .env
        pass: process.env.SMTP_PASS,  // Lấy từ .env
    }
});

// Hàm gửi email với token để reset mật khẩu
export const sendResetPasswordEmail = async (email, token) => {
    // Tạo đường dẫn chứa token cho người dùng để đặt lại mật khẩu
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

    const mailOptions = {
        from: process.env.SMTP_USER, // Người gửi
        to: email,                   // Người nhận
        subject: 'Password Reset Request', // Tiêu đề email
        html: `<p>Bạn đã yêu cầu đổi mật khẩu. Click vào link bên dưới để đổi mật khẩu</p>
               <a href="${resetUrl}">Đổi mật khẩu</a>` // Nội dung HTML với liên kết reset mật khẩu
    };

    // Gửi email
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Message sent: %s", info.messageId);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};
