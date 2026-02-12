import { Router } from 'express';
import { AuthController } from './auth.controller';
import { ensureAuthenticated } from '../../shared/middlewares/ensureAuthenticated';
import { ensureAdmin } from '../../shared/middlewares/ensureAdmin';

const authRoutes = Router();
const authController = new AuthController();


authRoutes.post('/register', authController.register);
authRoutes.post('/login', authController.login);

authRoutes.post('/forgot-password', authController.forgotPassword);
authRoutes.post('/reset-password', authController.resetPassword);

authRoutes.get('/profile', ensureAuthenticated, ensureAdmin, authController.profile);

export { authRoutes };