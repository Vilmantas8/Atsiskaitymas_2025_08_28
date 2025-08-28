import express from 'express';
import { body } from 'express-validator';
import { register, login, getMe } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Validation rules
const registerValidation = [
    body('username')
        .trim()
        .isLength({ min: 3, max: 30 })
        .withMessage('Vartotojo vardas turi būti 3-30 simbolių')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Vartotojo vardas gali turėti tik raides, skaičius ir pabraukimą'),
        
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Neteisingas el. pašto formatas'),
        
    body('password')
        .isLength({ min: 6, max: 100 })
        .withMessage('Slaptažodis turi būti 6-100 simbolių')
];

const loginValidation = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Neteisingas el. pašto formatas'),
        
    body('password')
        .notEmpty()
        .withMessage('Slaptažodis būtinas')
];

// Routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/me', authenticateToken, getMe);

export default router;
