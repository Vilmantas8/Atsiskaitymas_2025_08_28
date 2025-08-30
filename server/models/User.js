import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Vartotojo vardas būtinas / Username is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Vartotojo vardas turi būti bent 3 simboliai / Username must be at least 3 characters']
    },
    email: {
        type: String,
        required: [true, 'El. paštas būtinas / Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Neteisingas el. pašto formatas / Invalid email format']
    },
    password: {
        type: String,
        required: [true, 'Slaptažodis būtinas / Password is required'],
        minlength: [6, 'Slaptažodis turi būti bent 6 simboliai / Password must be at least 6 characters']
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, {
    timestamps: true,
    collection: 'users'
});

// Užšifruoti slaptažodį prieš išsaugojimą
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Slaptažodžio palyginimo metodas
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Pašalinti slaptažodį iš JSON išvesties
userSchema.methods.toJSON = function() {
    const user = this.toObject();
    delete user.password;
    return user;
};

export default mongoose.model('User', userSchema);
