import mongoose from 'mongoose';
import { OtpDocument, OtpType } from '../types';

const OtpSchema = new mongoose.Schema<OtpDocument>({
    phonenumber: {
        type: String,
        required: true,
        index: true
    },
    otp: {
        type: String,
        required: true,
        length: 6
    },
    type: {
        type: String,
        required: true,
        enum: ['registration', 'password_reset'] as OtpType[],
        default: 'registration'
    },
    expiresAt: {
        type: Date,
        required: true,
        index: true
    },
    attempts: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
        max: 3
    },
    isUsed: {
        type: Boolean,
        required: true,
        default: false
    },
    otpToken: {
        type: String,
        required: false,
        unique: true,
        sparse: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
});

// Index pour optimiser les recherches
OtpSchema.index({ phonenumber: 1, type: 1 });
OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL automatique
OtpSchema.index({ otpToken: 1 });

// Middleware pour nettoyer les OTP expirés
OtpSchema.pre('save', function(next) {
    if (this.isNew) {
        // Définir l'expiration à 10 minutes
        this.expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    }
    next();
});

// Méthode pour vérifier si l'OTP est valide
OtpSchema.methods.isValid = function(): boolean {
    return !this.isUsed && 
           this.attempts < 4 && 
           this.expiresAt > new Date();
};

// Méthode pour incrémenter les tentatives
OtpSchema.methods.incrementAttempts = function(): void {
    this.attempts += 1;
    this.save();
};

// Méthode pour marquer comme utilisé
OtpSchema.methods.markAsUsed = function(): void {
    this.isUsed = true;
    this.save();
};

export default mongoose.model<OtpDocument>('Otp', OtpSchema); 