import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authenticateToken = async (req, res, next) => {
    try {
        // Gauti tokeną iš antraštės
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({ 
                message: 'Prieigos tokenas nerastas / Access token not found' 
            });
        }

        // Patikrinti tokeną
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Gauti vartotoją iš duomenų bazės
        const user = await User.findById(decoded.userId);
        
        if (!user) {
            return res.status(401).json({ 
                message: 'Vartotojas nerastas / User not found' 
            });
        }

        // Pridėti vartotoją prie užklausos objekto
        req.user = user;
        next();
        
    } catch (error) {
        console.error('Token verification error:', error);
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                message: 'Tokenas pasibaigęs / Token expired' 
            });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                message: 'Neteisingas tokenas / Invalid token' 
            });
        }
        
        return res.status(500).json({ 
            message: 'Tokeno patikrinimo klaida / Token verification error' 
        });
    }
};

export const generateToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
};
