import { Router } from 'express';
import { AuthController } from './auth.controller';
import { ensureAuthenticated } from '../../shared/middlewares/ensureAuthenticated';

const authRoutes = Router();
const authController = new AuthController();


authRoutes.post('/register', authController.register);
authRoutes.post('/login', authController.login);

authRoutes.get('/profile', ensureAuthenticated, authController.profile);

export { authRoutes };