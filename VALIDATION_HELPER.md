# Helper de Validation de Champs

Ce helper de validation fournit un système complet et flexible pour valider les données d'entrée dans votre application.

## 🚀 Fonctionnalités

- ✅ Validation de types (string, number, email, phone, password)
- ✅ Validation de longueur (minLength, maxLength)
- ✅ Validation par expressions régulières (pattern)
- ✅ Validation personnalisée (custom)
- ✅ Validation de champs requis/optionnels
- ✅ Messages d'erreur en français
- ✅ Middlewares Express.js intégrés
- ✅ Validation de champs uniques ou multiples

## 📁 Structure des fichiers

```
src/
├── utils/
│   ├── validationHelper.ts      # Helper principal de validation
│   └── validationExamples.ts    # Exemples d'utilisation
├── middlewares/
│   └── validationMiddleware.ts  # Middlewares Express.js
└── controllers/
    └── auth.controller.ts       # Contrôleur avec validation intégrée
```

## 🔧 Utilisation

### 1. Validation de base

```typescript
import { validateFields, ValidationRule } from '../utils/validationHelper';

const data = {
  email: "test@example.com",
  password: "MotDePasse123!"
};

const rules = {
  email: {
    required: true,
    type: 'email'
  },
  password: {
    required: true,
    type: 'password'
  }
};

const result = validateFields(data, rules);
if (!result.isValid) {
  console.log("Erreurs:", result.errors);
}
```

### 2. Validation d'un champ unique

```typescript
import { validateSingleField, ValidationRule } from '../utils/validationHelper';

const emailRule: ValidationRule = {
  required: true,
  type: 'email'
};

const result = validateSingleField("test@example.com", emailRule, "email");
```

### 3. Validation personnalisée

```typescript
const rules = {
  age: {
    required: true,
    type: 'number',
    custom: (value) => {
      if (value < 18) {
        return "L'âge minimum requis est de 18 ans";
      }
      return true;
    }
  }
};
```

### 4. Utilisation avec Express.js

```typescript
import { validateRegistrationData } from '../middlewares/validationMiddleware';

router.post("/register", validateRegistrationData, authController.register);
```

## 📋 Types de validation disponibles

### Types prédéfinis

- `'string'` - Chaîne de caractères
- `'number'` - Nombre
- `'email'` - Adresse email valide
- `'phone'` - Numéro de téléphone français
- `'password'` - Mot de passe sécurisé (8+ caractères, majuscule, minuscule, chiffre, caractère spécial)

### Règles de validation

```typescript
interface ValidationRule {
  required?: boolean;           // Champ obligatoire
  minLength?: number;          // Longueur minimale
  maxLength?: number;          // Longueur maximale
  pattern?: RegExp;            // Expression régulière
  type?: 'string' | 'number' | 'email' | 'phone' | 'password';
  custom?: (value: any) => boolean | string; // Validation personnalisée
}
```

## 🎯 Exemples d'utilisation

### Validation d'inscription

```typescript
const registrationRules = {
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
```

### Validation de connexion

```typescript
const loginRules = {
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
```

### Validation d'OTP

```typescript
const otpRules = {
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
```

## 🔄 Middlewares disponibles

- `validateRegistrationData` - Validation pour l'inscription
- `validateLoginData` - Validation pour la connexion
- `validateSendOtpData` - Validation pour l'envoi d'OTP
- `validateVerifyOtpData` - Validation pour la vérification d'OTP
- `createValidationMiddleware` - Création de middleware personnalisé

## 🧪 Tests

Pour tester les validations, vous pouvez utiliser le fichier `validationExamples.ts` :

```typescript
import { runAllValidationExamples } from '../utils/validationExamples';

runAllValidationExamples();
```

## 📝 Messages d'erreur

Le helper génère automatiquement des messages d'erreur en français :

- "Le champ 'nom' est requis"
- "Le champ 'email' doit être une adresse email valide"
- "Le champ 'password' doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial"
- "Le champ 'phonenumber' doit être un numéro de téléphone français valide"

## 🚀 Intégration dans votre projet

1. **Dans les contrôleurs** : Utilisez les fonctions de validation directement
2. **Dans les routes** : Utilisez les middlewares de validation
3. **Pour des cas spéciaux** : Créez vos propres règles de validation

## 🔧 Personnalisation

Vous pouvez facilement étendre le système en :

1. Ajoutant de nouveaux types de validation
2. Créant des règles de validation personnalisées
3. Modifiant les messages d'erreur
4. Ajoutant de nouveaux middlewares

## 📚 Bonnes pratiques

1. **Validez toujours les données d'entrée** avant traitement
2. **Utilisez des messages d'erreur clairs** et en français
3. **Testez vos validations** avec différents cas d'usage
4. **Réutilisez les règles** communes entre différents endpoints
5. **Documentez les règles** de validation complexes 