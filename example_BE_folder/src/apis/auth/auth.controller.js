import AuthService from './auth.services.js';

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
}

export default new AuthController();
