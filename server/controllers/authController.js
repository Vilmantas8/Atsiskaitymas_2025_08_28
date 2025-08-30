import { validationResult } from 'express-validator';
import User from '../models/User.js';
import { generateToken } from '../middleware/auth.js';

// Registruoti naują vartotoją
export const register = async (req, res) => {
    try {
        // Patikrinti validacijos klaidas
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: 'Validacijos klaidos',
                errors: errors.array()
            });
        }

        const { username, email, password } = req.body;

        // Patikrinti, ar vartotojas jau egzistuoja
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(400).json({
                message: 'Vartotojas jau egzistuoja',
                field: existingUser.email === email ? 'email' : 'username'
            });
        }

        // Sukurti naują vartotoją
        const user = new User({
            username,
            email,
            password
        });

        await user.save();

        // Generuoti tokeną
        const token = generateToken(user._id);

        res.status(201).json({
            message: 'Vartotojas sėkmingai sukurtas',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        
        // Apdoroti duplikato rakto klaidą
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({
                message: `${field} jau naudojamas`,
                field
            });
        }

        res.status(500).json({
            message: 'Serverio klaida registracijoje',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Prisijungti vartotoją
export const login = async (req, res) => {
    try {
        // Patikrinti validacijos klaidas
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: 'Validacijos klaidos',
                errors: errors.array()
            });
        }

        const { email, password } = req.body;

        // Rasti vartotoją pagal el. paštą
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: 'Neteisingi prisijungimo duomenys'
            });
        }

        // Patikrinti slaptažodį
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: 'Neteisingi prisijungimo duomenys'
            });
        }

        // Generuoti tokeną
        const token = generateToken(user._id);

        res.json({
            message: 'Prisijungimas sėkmingas',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            message: 'Serverio klaida prisijungime',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Gauti dabartinio vartotojo informaciją
export const getMe = async (req, res) => {
    try {
        res.json({
            message: 'Vartotojo informacija',
            user: {
                id: req.user._id,
                username: req.user.username,
                email: req.user.email,
                role: req.user.role,
                createdAt: req.user.createdAt
            }
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            message: 'Nepavyko gauti vartotojo informacijos'
        });
    }
};
