# DOCUMENTATION TECHNIQUE DU SERVEUR

## Arborsence des repertoires.

/
│── /src
│   ├── /configs          # Configuration (MongoDB, env, etc.)
│   ├── /controllers     # Gestion des requêtes
│   ├── /middlewares     # Middlewares (validation, erreurs)
│   ├── /models          # Modèles MongoDB
│   ├── /routes          # Routes de l'API
│   ├── /services        # Logique métier
│   ├── /utils           # Fonctions utilitaires
│   ├── app.ts           # Initialisation de l’app
│   ├── server.ts        # Lancement du serveur
│── tests/      <-- Répertoire dédié aux tests
│── .env.dev               # Variables d’environnement dev
│── .env.prod              # Variables d’environnement prod
│── .env.staging           # Variables d’environnement staging
│── .gitignore
│── package-lock.json
│── package.json
│── README.md
│── tsconfig.json

