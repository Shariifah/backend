// src/types/index.ts
// Centralisation de toutes les interfaces et types de l'application

import mongoose from "mongoose";

// 🔹 Interface pour le document utilisateur
export interface UserDocument extends mongoose.Document {
    firstname: string;
    lastname: string;
    phonenumber: string;
    password: string;
    status: string;
    role: string;
    permissions: string[];
    lastLogin: Date;
    created_at: Date;
    updated_at: Date;
}

// 🔹 Types pour les rôles utilisateur
export type UserRole = 'user' | 'admin';

// 🔹 Types pour les statuts utilisateur
export type UserStatus = 'active' | 'inactive' | 'suspended';

// 🔹 Interface pour les données d'inscription
export interface RegistrationData {
    lastname: string;
    firstname: string;
    phonenumber: string;
    password: string;
    verifyPassword: string;
}

// 🔹 Interface pour les données de connexion
export interface LoginData {
    phonenumber: string;
    password: string;
}

// 🔹 Interface pour les données d'OTP
export interface OtpData {
    phonenumber: string;
    otp?: string;
}

// 🔹 Interface pour les tokens JWT
export interface JwtPayload {
    userId: string;
    role?: string;
    type?: 'refresh' | 'access';
    exp?: number;
    iat?: number;
}

// 🔹 Interface pour les réponses API
export interface ApiResponse<T = any> {
    success: boolean;
    code: number;
    message: string;
    data?: T;
    errors?: string[];
}

// 🔹 Interface pour les erreurs de validation
export interface ValidationError {
    field: string;
    message: string;
}

// 🔹 Interface pour les permissions
export interface Permission {
    name: string;
    description: string;
    resource: string;
    action: string;
}

// 🔹 Interface pour les données de profil utilisateur (sans mot de passe)
export interface UserProfile {
    _id: string;
    firstname: string;
    lastname: string;
    phonenumber: string;
    status: UserStatus;
    role: UserRole;
    permissions: string[];
    lastLogin: Date;
    created_at: Date;
    updated_at: Date;
}

// 🔹 Interface pour la création d'utilisateur (sans mot de passe hashé)
export interface CreateUserData {
    lastname: string;
    firstname: string;
    phonenumber: string;
    password: string;
}

// 🔹 Interface pour la mise à jour d'utilisateur
export interface UpdateUserData {
    firstname?: string;
    lastname?: string;
    status?: UserStatus;
    role?: UserRole;
    lastLogin?: Date;
}

// 🔹 Interface pour les filtres de recherche utilisateur
export interface UserFilters {
    status?: UserStatus;
    role?: UserRole;
    phonenumber?: string;
    search?: string;
}

// 🔹 Interface pour la pagination
export interface PaginationOptions {
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

// 🔹 Interface pour les résultats paginés
export interface PaginatedResult<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

// 🔹 Types pour les OTP
export type OtpType = 'registration' | 'password_reset';

// 🔹 Interface pour le document OTP
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

// 🔹 Interface pour les données de demande d'OTP
export interface RequestOtpData {
    phonenumber: string;
}

// 🔹 Interface pour les données de vérification d'OTP
export interface VerifyOtpData {
    phonenumber: string;
    otp: string;
}

// 🔹 Interface pour les données d'inscription avec token OTP
export interface RegisterWithOtpData {
    otp_token: string;
    firstname: string;
    lastname: string;
    phonenumber: string;
    password: string;
    verifyPassword: string;
}

// 🔹 Interface pour la réponse de vérification d'OTP
export interface OtpVerificationResponse {
    otp_token: string;
    phonenumber: string;
    expiresIn: number; // en minutes
} 