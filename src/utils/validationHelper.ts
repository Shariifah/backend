import {FieldValidation, ValidationResult, ValidationRule} from "../types/interfaces";

/**
 * Validation des champs selon les règles définies
 */
export function validateFields(data: any, rules: FieldValidation): ValidationResult {
  const errors: string[] = [];

  for (const [fieldName, rule] of Object.entries(rules)) {
    const value = data[fieldName];
    
    // Vérification si le champ est requis
    if (rule.required && (value === undefined || value === null || value === '')) {
      errors.push(`Le champ '${fieldName}' est requis`);
      continue;
    }

    // Si la valeur n'est pas définie et le champ n'est pas requis, on passe
    if (value === undefined || value === null || value === '') {
      continue;
    }

    // Validation du type
    if (rule.type) {
      const typeError = validateType(value, rule.type, fieldName);
      if (typeError) {
        errors.push(typeError);
        continue;
      }
    }

    // Validation de la longueur pour les chaînes
    if (typeof value === 'string') {
      if (rule.minLength && value.length < rule.minLength) {
        errors.push(`Le champ '${fieldName}' doit contenir au moins ${rule.minLength} caractères`);
      }
      
      if (rule.maxLength && value.length > rule.maxLength) {
        errors.push(`Le champ '${fieldName}' ne doit pas dépasser ${rule.maxLength} caractères`);
      }
    }

    // Validation par pattern (regex)
    if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
      errors.push(`Le format du champ '${fieldName}' est invalide`);
    }

    // Validation personnalisée
    if (rule.custom) {
      const customResult = rule.custom(value);
      if (typeof customResult === 'string') {
        errors.push(customResult);
      } else if (!customResult) {
        errors.push(`Le champ '${fieldName}' ne respecte pas les critères de validation`);
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validation du type de données
 */
function validateType(value: any, type: string, fieldName: string): string | null {
  switch (type) {
    case 'string':
      if (typeof value !== 'string') {
        return `Le champ '${fieldName}' doit être une chaîne de caractères`;
      }
      break;
      
    case 'number':
      if (isNaN(Number(value))) {
        return `Le champ '${fieldName}' doit être un nombre`;
      }
      break;
      
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return `Le champ '${fieldName}' doit être une adresse email valide`;
      }
      break;
      
    case 'phone':
      const phoneRegex = /^(226)[1-9](\d{7})$/;
      if (!phoneRegex.test(value)) {
        return `Le champ '${fieldName}' doit être un numéro de téléphone burkinabé valide`;
      }
      break;
      
    case 'password':
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(value)) {
        return `Le champ '${fieldName}' doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial`;
      }
      break;
  }
  
  return null;
}

/**
 * Validation spécifique pour l'inscription
 */
export function validateRegistration(data: any): ValidationResult {
  const rules: FieldValidation = {
    lastname: {
      required: true,
      type: 'string',
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-ZÀ-ÿ\s'-]+$/
    },
    firstname: {
      required: true,
      type: 'string',
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-ZÀ-ÿ\s'-]+$/
    },
    phonenumber: {
      required: true,
      type: 'phone'
    },
    password: {
      required: true,
      type: 'password'
    },
    verifyPassword: {
      required: true,
      type: 'string',
      custom: (value) => {
        if (value !== data.password) {
          return "Les mots de passe ne correspondent pas";
        }
        return true;
      }
    }
  };

  return validateFields(data, rules);
}

/**
 * Validation spécifique pour la connexion
 */
export function validateLogin(data: any): ValidationResult {
  const rules: FieldValidation = {
    phonenumber: {
      required: true,
      type: 'phone'
    },
    password: {
      required: true,
      type: 'string',
      minLength: 1
    }
  };

  return validateFields(data, rules);
}

/** 
 * Validation pour l'envoi d'OTP
 */
export function validateSendOtp(data: any): ValidationResult {
  const rules: FieldValidation = {
    phonenumber: {
      required: true,
      type: 'phone'
    }
  };

  return validateFields(data, rules);
}

/**
 * Middleware de validation générique
 */
export function createValidationMiddleware(validationFunction: (data: any) => ValidationResult) {
  return (req: any, res: any, next: any) => {
    const validation = validationFunction(req.body);
    
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        code: 400,
        message: "Erreur de validation",
        errors: validation.errors
      });
    }
    
    next();
  };
}

/**
 * Validation d'un champ unique
 */
export function validateSingleField(value: any, rule: ValidationRule, fieldName: string): ValidationResult {
  const rules: FieldValidation = {
    [fieldName]: rule
  };
  
  return validateFields({ [fieldName]: value }, rules);
}

/**
 * Validation pour la demande d'OTP (Étape 1)
 */
export function validateRequestOtp(data: any): ValidationResult {
  const rules: FieldValidation = {
    phonenumber: {
      required: true,
      type: 'phone'
    }
  };

  return validateFields(data, rules);
}

/**
 * Validation pour la vérification d'OTP (Étape 2)
 */
export function validateVerifyOtp(data: any): ValidationResult {
  const rules: FieldValidation = {
    phonenumber: {
      required: true,
      type: 'phone'
    },
    otp: {
      required: true,
      type: 'string',
      pattern: /^\d{6}$/,
      custom: (value) => {
        if (value.length !== 6) {
          return "Le code OTP doit contenir exactement 6 chiffres";
        }
        return true;
      }
    }
  };

  return validateFields(data, rules);
}

/**
 * Validation pour l'inscription avec token OTP (Étape 3)
 */
export function validateRegisterWithOtp(data: any): ValidationResult {
  const rules: FieldValidation = {
    otpToken: {
      required: true,
      type: 'string',
      minLength: 32,
      maxLength: 64
    },
    firstname: {
      required: true,
      type: 'string',
      minLength: 2,
      maxLength: 50
    },
    lastname: {
      required: true,
      type: 'string',
      minLength: 2,
      maxLength: 50
    },
    phonenumber: {
      required: true,
      type: 'phone'
    },
    password: {
      required: true,
      type: 'password',
      minLength: 8,
      maxLength: 128,
      custom: (value) => {
        // Vérifier la complexité du mot de passe
        const hasUpperCase = /[A-Z]/.test(value);
        const hasLowerCase = /[a-z]/.test(value);
        const hasNumbers = /\d/.test(value);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
        
        if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
          return "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial";
        }
        return true;
      }
    },
    verifyPassword: {
      required: true,
      type: 'string',
      custom: (value) => {
        if (value !== data.password) {
          return "Les mots de passe ne correspondent pas";
        }
        return true;
      }
    }
  };

  return validateFields(data, rules);
} 