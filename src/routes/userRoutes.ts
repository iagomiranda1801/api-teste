import express from 'express';
import { UserController } from '../controllers/UserController';
import { validateUserRegister, validateUserUpdate } from '../middleware/validation';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = express.Router();

/**
 * @route POST /users/register
 * @desc Registro público de usuário (sem autenticação)
 * @access Public
 */
router.post('/register', validateUserRegister, UserController.registerUser);

/**
 * @route GET /users
 * @desc Listar todos os usuários com paginação
 * @access Private (Admin only)
 * @query page - Número da página (padrão: 1)
 * @query limit - Limite por página (padrão: 10)
 * @query search - Buscar por nome ou email
 */
// Permite que clientes autenticados acessem e vejam apenas seus dados; administradores veem todos os usuários
router.get('/', authenticateToken, UserController.getUsers);

/**
 * @route GET /users/:id
 * @desc Buscar usuário por ID
 * @access Private (Admin only)
 */
router.get('/:id', authenticateToken, requireAdmin, UserController.getUserById);

/**
 * @route GET /users/email/:email
 * @desc Buscar usuário por email
 * @access Private (Admin only)
 */
router.get('/email/:email', authenticateToken, requireAdmin, UserController.getUserByEmail);

/**
 * @route POST /users
 * @desc Criar novo usuário
 * @access Private (Admin only)
 */
router.post('/', authenticateToken, requireAdmin, validateUserRegister, UserController.createUser);

/**
 * @route PUT /users/:id
 * @desc Atualizar usuário por ID
 * @access Private (Admin only)
 */
router.put('/:id', authenticateToken, requireAdmin, validateUserUpdate, UserController.updateUser);

/**
 * @route PATCH /users/:id
 * @desc Atualização parcial do usuário
 * @access Private (Admin only)
 */
router.patch('/:id', authenticateToken, requireAdmin, UserController.updateUser);

/**
 * @route DELETE /users/:id
 * @desc Deletar usuário por ID
 * @access Private (Admin only)
 */
router.delete('/:id', authenticateToken, requireAdmin, UserController.deleteUser);

export default router;