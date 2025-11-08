import express from 'express';
import { AuthController } from '../controllers/AuthController';
import { validateLogin, validateUserRegister, validateClientRegister } from '../middleware/validation';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = express.Router();

/**
 * @route POST /auth/login/user
 * @desc Login para usuários (admin/user)
 * @access Public
 */
router.post('/login/user', validateLogin, AuthController.loginUser);

/**
 * @route POST /auth/login/client
 * @desc Login para clientes
 * @access Public
 */
router.post('/login/client', validateLogin, AuthController.loginClient);

/**
 * @route POST /auth/register/user
 * @desc Registro de usuário (apenas admin pode criar)
 * @access Private (Admin only)
 */
router.post('/register/user', authenticateToken, requireAdmin, validateUserRegister, AuthController.registerUser);

/**
 * @route POST /auth/register/client
 * @desc Registro de cliente
 * @access Public
 */
router.post('/register/client', validateClientRegister, AuthController.registerClient);

/**
 * @route GET /auth/me
 * @desc Obter dados do usuário/cliente logado
 * @access Private
 */
router.get('/me', authenticateToken, AuthController.getMe);

export default router;