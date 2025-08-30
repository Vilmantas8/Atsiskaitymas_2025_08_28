import { validationResult } from 'express-validator';
import Booking from '../models/Booking.js';

// Gauti visas dabartinio vartotojo rezervacijas
export const getAllBookings = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Gauti užklausos parametrus filtravimui
        const { cinemaName, date, status } = req.query;
        
        // Sukurti filtro objektą
        let filter = { userId: req.user._id };
        if (cinemaName) filter.cinemaName = new RegExp(cinemaName, 'i');
        if (date) filter.date = new Date(date);
        if (status) filter.status = status;

        const bookings = await Booking.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('userId', 'username email');

        const total = await Booking.countDocuments(filter);

        res.json({
            message: 'Rezervacijos sėkmingai gautos / Bookings retrieved successfully',
            bookings,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('Get bookings error:', error);
        res.status(500).json({
            message: 'Nepavyko gauti rezervacijų / Failed to get bookings',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Gauti vieną rezervaciją pagal ID
export const getBookingById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const booking = await Booking.findOne({ 
            _id: id, 
            userId: req.user._id 
        }).populate('userId', 'username email');

        if (!booking) {
            return res.status(404).json({
                message: 'Rezervacija nerasta / Booking not found'
            });
        }

        res.json({
            message: 'Rezervacija rasta / Booking found',
            booking
        });

    } catch (error) {
        console.error('Get booking error:', error);
        res.status(500).json({
            message: 'Nepavyko gauti rezervacijos / Failed to get booking',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Sukurti naują rezervaciją
export const createBooking = async (req, res) => {
    try {
        // Patikrinti validacijos klaidas
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: 'Validacijos klaidos / Validation errors',
                errors: errors.array()
            });
        }

        const { cinemaName, date, price, bookingTime, stageSquares, seatNumber } = req.body;

        // Patikrinti, ar vieta jau rezervuota tam pačiam kino teatrui, datai ir laikui
        const existingBooking = await Booking.findOne({
            cinemaName,
            date: new Date(date),
            bookingTime,
            seatNumber,
            status: 'active'
        });

        if (existingBooking) {
            return res.status(400).json({
                message: `Vieta ${seatNumber} jau užimta šiam seansui / Seat ${seatNumber} already booked for this session`
            });
        }

        // Sukurti naują rezervaciją
        const booking = new Booking({
            cinemaName,
            date: new Date(date),
            price,
            bookingTime,
            stageSquares,
            seatNumber,
            userId: req.user._id
        });

        const savedBooking = await booking.save();
        await savedBooking.populate('userId', 'username email');

        res.status(201).json({
            message: 'Rezervacija sėkmingai sukurta / Booking created successfully',
            booking: savedBooking
        });

    } catch (error) {
        console.error('Create booking error:', error);
        
        // Apdoroti dubliuotą rezervaciją
        if (error.code === 11000) {
            return res.status(400).json({
                message: 'Ši vieta jau užimta / This seat is already taken'
            });
        }

        res.status(500).json({
            message: 'Nepavyko sukurti rezervacijos / Failed to create booking',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Atnaujinti rezervaciją
export const updateBooking = async (req, res) => {
    try {
        // Patikrinti validacijos klaidas
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: 'Validacijos klaidos / Validation errors',
                errors: errors.array()
            });
        }

        const { id } = req.params;
        const { cinemaName, date, price, bookingTime, stageSquares, seatNumber } = req.body;

        // Rasti esamą rezervaciją
        const booking = await Booking.findOne({ _id: id, userId: req.user._id });
        
        if (!booking) {
            return res.status(404).json({
                message: 'Rezervacija nerasta / Booking not found'
            });
        }

        // Jei keičiama vieta ar laikas, patikrinti konfliktus
        if (seatNumber !== booking.seatNumber || 
            bookingTime !== booking.bookingTime || 
            date !== booking.date.toISOString().split('T')[0] ||
            cinemaName !== booking.cinemaName) {
            
            const existingBooking = await Booking.findOne({
                _id: { $ne: id },
                cinemaName: cinemaName || booking.cinemaName,
                date: new Date(date || booking.date),
                bookingTime: bookingTime || booking.bookingTime,
                seatNumber: seatNumber || booking.seatNumber,
                status: 'active'
            });

            if (existingBooking) {
                return res.status(400).json({
                    message: `Vieta ${seatNumber || booking.seatNumber} jau užimta šiam seansui / Seat ${seatNumber || booking.seatNumber} already booked for this session`
                });
            }
        }

        // Atnaujinti rezervaciją
        const updatedBooking = await Booking.findByIdAndUpdate(
            id,
            {
                cinemaName: cinemaName || booking.cinemaName,
                date: date ? new Date(date) : booking.date,
                price: price || booking.price,
                bookingTime: bookingTime || booking.bookingTime,
                stageSquares: stageSquares || booking.stageSquares,
                seatNumber: seatNumber || booking.seatNumber
            },
            { new: true, runValidators: true }
        ).populate('userId', 'username email');

        res.json({
            message: 'Rezervacija sėkmingai atnaujinta / Booking updated successfully',
            booking: updatedBooking
        });

    } catch (error) {
        console.error('Update booking error:', error);
        res.status(500).json({
            message: 'Nepavyko atnaujinti rezervacijos / Failed to update booking',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Ištrinti rezervaciją
export const deleteBooking = async (req, res) => {
    try {
        const { id } = req.params;
        
        const booking = await Booking.findOneAndDelete({ 
            _id: id, 
            userId: req.user._id 
        });

        if (!booking) {
            return res.status(404).json({
                message: 'Rezervacija nerasta / Booking not found'
            });
        }

        res.json({
            message: 'Rezervacija sėkmingai ištrinta / Booking deleted successfully',
            booking
        });

    } catch (error) {
        console.error('Delete booking error:', error);
        res.status(500).json({
            message: 'Nepavyko ištrinti rezervacijos / Failed to delete booking',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Gauti laisvas vietas konkrečiam seansui
export const getAvailableSeats = async (req, res) => {
    try {
        const { cinemaName, date, bookingTime, stageSquares } = req.query;

        if (!cinemaName || !date || !bookingTime || !stageSquares) {
            return res.status(400).json({
                message: 'Trūksta parametrų / Missing required parameters'
            });
        }

        // Gauti visas rezervuotas vietas šiam seansui
        const bookedSeats = await Booking.find({
            cinemaName,
            date: new Date(date),
            bookingTime,
            status: 'active'
        }).select('seatNumber');

        const bookedSeatNumbers = bookedSeats.map(booking => booking.seatNumber);
        const totalSeats = parseInt(stageSquares);
        const availableSeats = [];

        for (let i = 1; i <= totalSeats; i++) {
            if (!bookedSeatNumbers.includes(i)) {
                availableSeats.push(i);
            }
        }

        res.json({
            message: 'Laisvos vietos gautos / Available seats retrieved',
            availableSeats,
            bookedSeats: bookedSeatNumbers,
            totalSeats,
            availableCount: availableSeats.length
        });

    } catch (error) {
        console.error('Get available seats error:', error);
        res.status(500).json({
            message: 'Nepavyko gauti laisvų vietų / Failed to get available seats',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
