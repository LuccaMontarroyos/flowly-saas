import { Router } from 'express';
import { AuthController } from './auth.controller';

const authRoutes = Router();
const authController = new AuthController();

// POST /api/v1/auth/register
// Cria a Empresa + Usuário Admin
authRoutes.post('/register', authController.register);

// POST /api/v1/auth/login
// Autentica e retorna o JWT com o companyId dentro
authRoutes.post('/login', authController.login);

export { authRoutes };