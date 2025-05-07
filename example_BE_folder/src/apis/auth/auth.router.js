import express from 'express';
import AuthController from './auth.controller.js';

const authRoute = express.Router();

authRoute.post('/register', AuthController.register);
authRoute.post('/login', AuthController.login);
authRoute.post('/forgot-password', AuthController.forgotPassword);
authRoute.post('/reset-password', AuthController.resetPassword);
authRoute.post('/:id/avatar', upload.single('avatar'), AuthController.uploadAvatar);

export default authRoute;
