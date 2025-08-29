
// Types pour les rôles utilisateur
export type UserRole = 'user' | 'admin';

// Types pour les statuts utilisateur
export type UserStatus = 'active' | 'inactive' | 'suspended';

// Types pour les OTP
export type OtpType = 'registration' | 'password_reset';

// Types pour les tokens
export type TokenType = 'refresh' | 'access';

// Types pour la période de souscription
export type SubscriptionType = "mensuel" | "trimestriel" | "semestriel" | "annuel";

// Types pour les sujets
export type SubjectType = "cours" | "examen";

// Types pour le statut de paiement
export type PaymentStatus = "pending" | "paid" | "failed";

