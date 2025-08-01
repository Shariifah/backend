import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import { ALL_PERMISSIONS, getPermissionsForRole } from '../configs/permissions'; 
import { UserDocument } from '../types/interfaces';
import { UserRole, UserStatus } from '../types/types';

const UserSchema = new mongoose.Schema<UserDocument>({
    firstname: { 
        type: String, 
        required: true, 
        unique: false 
    },
    lastname: { 
        type: String, 
        required: true, 
        unique: false 
    },
    phonenumber: {
        type: String,
        required: true,
        unique: true
    },
    password: { 
        type: String, 
        required: true, 
        unique: false 
    },
    status: { 
        type: String, 
        required: true, 
        enum: ['active', 'inactive', 'suspended'] as UserStatus[],
        default: 'active'
    },
    role: {
        type: String,
        required: true,
        enum: ['user', 'admin'] as UserRole[],
        default: 'user'
    },
    permissions: {
        type: [String],
        enum: ALL_PERMISSIONS,
        required: true,
        default: []
    },
    lastLogin: {
        type: Date,
        default: null
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now()
    },
    updated_at: {
        type: Date,
        required: true,
        default: Date.now
    }
});


UserSchema.pre('save', async function(this: any, next: any) {
    if (this.isNew || this.isModified('role')) {
        this.permissions = getPermissionsForRole(this.role);
    }
    next();
});

UserSchema.pre('findOneAndUpdate', async function(this: any, next: any) {
    const update = this.getUpdate();
    if(!update) {
        return next();
    }
    if(update.status !== undefined) {
        if (!update.status || !['active', 'inactive', 'suspended'].includes(update.status as string)) {
            return next(new Error('Status invalide. Les valeurs autorisées sont: active, inactive, suspended'));
        }
    }
    if (update.role !== undefined) {
        if (!['user', 'admin'].includes(update.role as string)) {
            return next(new Error('Role invalide. Les valeurs autorisées sont: user, admin'));
        }
        update.permissions = getPermissionsForRole(update.role);
    }
    update.updated_at = Date.now();
    next();  
});

// Middleware pour forcer la validation sur les updates
UserSchema.pre(["updateOne", "findOneAndUpdate", "updateMany"], function(next) {
  this.setOptions({ runValidators: true });
  next();
});

// Index pour optimiser les recherches
UserSchema.index({ username: 1 });
UserSchema.index({ phonenumber: 1 });
UserSchema.index({ status: 1 });
UserSchema.index({ role: 1 });

// Plugin pour la validation des champs uniques
UserSchema.plugin(uniqueValidator);

export default mongoose.model('User', UserSchema);