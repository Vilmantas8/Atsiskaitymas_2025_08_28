import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    cinemaName: {
        type: String,
        required: [true, 'Kino pavadinimas būtinas / Cinema name is required'],
        trim: true,
        maxlength: [100, 'Kino pavadinimas per ilgas / Cinema name too long']
    },
    movieTitle: {
        type: String,
        trim: true,
        maxlength: [200, 'Filmo pavadinimas per ilgas / Movie title too long']
    },
    date: {
        type: Date,
        required: [true, 'Data būtina / Date is required'],
        validate: {
            validator: function(value) {
                return value >= new Date().setHours(0, 0, 0, 0);
            },
            message: 'Data negali būti praeityje / Date cannot be in the past'
        }
    },
    price: {
        type: Number,
        required: [true, 'Kaina būtina / Price is required'],
        min: [0, 'Kaina negali būti neigiama / Price cannot be negative'],
        max: [1000, 'Kaina per didelė / Price too high']
    },
    bookingTime: {
        type: String,
        required: [true, 'Rezervacijos laikas būtinas / Booking time is required'],
        match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Neteisingas laiko formatas (HH:MM) / Invalid time format (HH:MM)']
    },
    stageSquares: {
        type: Number,
        required: [true, 'Scenos kvadratų skaičius būtinas / Stage squares required'],
        min: [10, 'Per mažai vietų / Too few seats'],
        max: [500, 'Per daug vietų / Too many seats'],
        default: 100
    },
    seatNumber: {
        type: Number,
        required: [true, 'Vietos numeris būtinas / Seat number is required'],
        min: [1, 'Vietos numeris turi būti teigiamas / Seat number must be positive']
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Vartotojas būtinas / User is required']
    },
    status: {
        type: String,
        enum: ['active', 'cancelled'],
        default: 'active'
    }
}, {
    timestamps: true,
    collection: 'cinematika' // Naudojant nurodytą kolekcijos pavadinimą
});

// Patikrinti, kad vietos numeris neviršytų scenos kvadratų
bookingSchema.pre('save', function(next) {
    if (this.seatNumber > this.stageSquares) {
        const error = new Error('Vietos numeris negali viršyti bendro vietų skaičiaus / Seat number cannot exceed total seats');
        return next(error);
    }
    next();
});

// Sukurti indeksą unikaliai vietų rezervacijai pagal kino teatrą, datą ir laiką
bookingSchema.index({ 
    cinemaName: 1, 
    date: 1, 
    bookingTime: 1, 
    seatNumber: 1 
}, { 
    unique: true,
    partialFilterExpression: { status: 'active' }
});

export default mongoose.model('Booking', bookingSchema);
