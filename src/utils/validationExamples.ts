// src/utils/validationExamples.ts
// Exemples d'utilisation du helper de validation

import { 
  validateFields, 
  validateSingleField, 
  ValidationRule, 
  FieldValidation 
} from "./validationHelper";

// Exemple 1: Validation d'un formulaire d'inscription
export function exampleRegistrationValidation() {
  const userData = {
    lastname: "Dupont",
    firstname: "Jean",
    phonenumber: "0123456789",
    password: "MotDePasse123!",
    verifyPassword: "MotDePasse123!"
  };

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
        if (value !== userData.password) {
          return "Les mots de passe ne correspondent pas";
        }
        return true;
      }
    }
  };

  const result = validateFields(userData, rules);
  console.log("Résultat validation inscription:", result);
  return result;
}

// Exemple 2: Validation d'un champ unique
export function exampleSingleFieldValidation() {
  const emailRule: ValidationRule = {
    required: true,
    type: 'email'
  };

  const result = validateSingleField("test@example.com", emailRule, "email");
  console.log("Résultat validation email:", result);
  return result;
}

// Exemple 3: Validation personnalisée
export function exampleCustomValidation() {
  const data = {
    age: 25,
    username: "user123"
  };

  const rules: FieldValidation = {
    age: {
      required: true,
      type: 'number',
      custom: (value) => {
        if (value < 18) {
          return "L'âge minimum requis est de 18 ans";
        }
        if (value > 120) {
          return "L'âge maximum autorisé est de 120 ans";
        }
        return true;
      }
    },
    username: {
      required: true,
      type: 'string',
      minLength: 3,
      maxLength: 20,
      pattern: /^[a-zA-Z0-9_]+$/,
      custom: (value) => {
        if (value.includes('admin')) {
          return "Le nom d'utilisateur ne peut pas contenir 'admin'";
        }
        return true;
      }
    }
  };

  const result = validateFields(data, rules);
  console.log("Résultat validation personnalisée:", result);
  return result;
}

// Exemple 4: Validation d'un formulaire de contact
export function exampleContactFormValidation() {
  const contactData = {
    name: "Marie Martin",
    email: "marie.martin@example.com",
    phone: "0123456789",
    message: "Bonjour, j'ai une question..."
  };

  const rules: FieldValidation = {
    name: {
      required: true,
      type: 'string',
      minLength: 2,
      maxLength: 100,
      pattern: /^[a-zA-ZÀ-ÿ\s'-]+$/
    },
    email: {
      required: true,
      type: 'email'
    },
    phone: {
      required: false, // Optionnel
      type: 'phone'
    },
    message: {
      required: true,
      type: 'string',
      minLength: 10,
      maxLength: 1000
    }
  };

  const result = validateFields(contactData, rules);
  console.log("Résultat validation formulaire contact:", result);
  return result;
}

// Exemple 5: Validation avec gestion d'erreurs
export function exampleErrorHandling() {
  const invalidData = {
    email: "email-invalide",
    password: "123", // Trop court
    age: "non-numérique"
  };

  const rules: FieldValidation = {
    email: {
      required: true,
      type: 'email'
    },
    password: {
      required: true,
      type: 'password'
    },
    age: {
      required: true,
      type: 'number'
    }
  };

  const result = validateFields(invalidData, rules);
  
  if (!result.isValid) {
    console.log("Erreurs de validation trouvées:");
    result.errors.forEach((error, index) => {
      console.log(`${index + 1}. ${error}`);
    });
  }
  
  return result;
}

// Fonction utilitaire pour tester toutes les validations
export function runAllValidationExamples() {
  console.log("=== Tests de validation ===\n");
  
  console.log("1. Validation inscription:");
  exampleRegistrationValidation();
  
  console.log("\n2. Validation champ unique:");
  exampleSingleFieldValidation();
  
  console.log("\n3. Validation personnalisée:");
  exampleCustomValidation();
  
  console.log("\n4. Validation formulaire contact:");
  exampleContactFormValidation();
  
  console.log("\n5. Gestion d'erreurs:");
  exampleErrorHandling();
  
  console.log("\n=== Fin des tests ===");
} 