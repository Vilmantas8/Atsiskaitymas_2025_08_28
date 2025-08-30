import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Importuoti maršrutus
import authRoutes from './routes/auth.js';
import bookingRoutes from './routes/bookings.js';

// Įkelti aplinkos kintamuosius
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Paprastas registro middleware kūrimui
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
    next();
});

// MongoDB ryšys
const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB prisijungimas sėkmingas! / MongoDB connected successfully!');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

// Prisijungti prie duomenų bazės
connectDB();

// Maršrutai
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);

// Pagrindinis testavimo maršrutas
app.get('/api/test', (req, res) => {
    res.json({ 
        message: 'Serveris veikia! / Server is running!',
        timestamp: new Date().toISOString()
    });
});

// 404 apdorojimo priemonė
app.use('*', (req, res) => {
    res.status(404).json({ 
        message: 'Maršrutas nerastas / Route not found',
        path: req.originalUrl
    });
});

// Klaidų apdorojimo middleware
app.use((error, req, res, next) => {
    console.error('Server error:', error);
    res.status(500).json({ 
        message: 'Serverio klaida / Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
});

app.listen(PORT, () => {
    console.log(`Serveris paleistas / Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
});
