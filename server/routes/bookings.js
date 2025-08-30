import express from 'express';
import { body } from 'express-validator';
import { 
    getAllBookings, 
    getBookingById, 
    createBooking, 
    updateBooking, 
    deleteBooking,
    getAvailableSeats 
} from '../controllers/bookingController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Validacijos taisyklės rezervacijai
const bookingValidation = [
    body('cinemaName')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Kino pavadinimas turi būti 2-100 simbolių'),
        
    body('movieTitle')
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage('Filmo pavadinimas per ilgas'),
        
    body('date')
        .isISO8601()
        .toDate()
        .custom((value) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (value < today) {
                throw new Error('Data negali būti praeityje / Date cannot be in the past');
            }
            return true;
        }),
        
    body('price')
        .isFloat({ min: 0, max: 1000 })
        .withMessage('Kaina turi būti tarp 0 ir 1000 / Price must be between 0 and 1000'),
        
    body('bookingTime')
        .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage('Neteisingas laiko formatas (HH:MM) / Invalid time format (HH:MM)'),
        
    body('stageSquares')
        .isInt({ min: 10, max: 500 })
        .withMessage('Scenos kvadratų skaičius turi būti tarp 10 ir 500 / Stage squares must be between 10 and 500'),
        
    body('seatNumber')
        .isInt({ min: 1 })
        .withMessage('Vietos numeris turi būti teigiamas skaičius / Seat number must be positive')
        .custom((value, { req }) => {
            if (value > req.body.stageSquares) {
                throw new Error('Vietos numeris negali viršyti bendro vietų skaičiaus / Seat number cannot exceed total seats');
            }
            return true;
        })
];

// Atnaujinimo validacija (visi laukai neprivalomi)
const updateBookingValidation = [
    body('cinemaName')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Kino pavadinimas turi būti 2-100 simbolių'),
        
    body('movieTitle')
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage('Filmo pavadinimas per ilgas'),
        
    body('date')
        .optional()
        .isISO8601()
        .toDate()
        .custom((value) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (value < today) {
                throw new Error('Data negali būti praeityje / Date cannot be in the past');
            }
            return true;
        }),
        
    body('price')
        .optional()
        .isFloat({ min: 0, max: 1000 })
        .withMessage('Kaina turi būti tarp 0 ir 1000 / Price must be between 0 and 1000'),
        
    body('bookingTime')
        .optional()
        .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage('Neteisingas laiko formatas (HH:MM) / Invalid time format (HH:MM)'),
        
    body('stageSquares')
        .optional()
        .isInt({ min: 10, max: 500 })
        .withMessage('Scenos kvadratų skaičius turi būti tarp 10 ir 500 / Stage squares must be between 10 and 500'),
        
    body('seatNumber')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Vietos numeris turi būti teigiamas skaičius / Seat number must be positive')
];

// Taikyti autentifikaciją visiems maršrutams
router.use(authenticateToken);

// Maršrutai
router.get('/', getAllBookings);
router.get('/available-seats', getAvailableSeats);
router.get('/:id', getBookingById);
router.post('/', bookingValidation, createBooking);
router.put('/:id', updateBookingValidation, updateBooking);
router.delete('/:id', deleteBooking);

export default router;
