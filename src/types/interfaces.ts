import mongoose from "mongoose";
import {OtpType, UserRole, UserStatus, TokenType} from "./types";

// Interface pour le document utilisateur
export interface UserDocument extends mongoose.Document {
    firstname: string;
    lastname: string;
    phonenumber: string;
    password: string;
    status: UserStatus;
    role: UserRole;
    permissions: string[];
    lastLogin: Date;
    created_at: Date;
    updated_at: Date;
}

// Interface pour le document OTP
export interface OtpDocument extends mongoose.Document {
    phonenumber: string;
    otp: string;
    type: OtpType;
    expiresAt: Date;
    attempts: number;
    isUsed: boolean;
    otpToken?: string;
    createdAt: Date;
    isValid(): boolean;
    incrementAttempts(): void;
    markAsUsed(): void;
}

// Interface pour le payload JWT
export interface JwtPayload {
    userId: string;
    role?: UserRole;
    type?: TokenType;
    exp?: number;
    iat?: number;
}

// Interface pour les règles de validation
export interface ValidationRule {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    type?: 'string' | 'number' | 'email' | 'phone' | 'password';
    custom?: (value: any) => boolean | string;
}

// Interface pour les résultats de validation
export interface ValidationResult {
    isValid: boolean;
    errors: string[];
}
  
// Interface pour les champs de validation
export interface FieldValidation {
    [key: string]: ValidationRule;
}
  