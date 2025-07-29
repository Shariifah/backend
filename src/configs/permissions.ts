// Définition des actions CRUD
const ACTIONS = {
    CREATE: 'create',
    READ: 'read',
    UPDATE: 'update',
    DELETE: 'delete'
} as const;

type Action = typeof ACTIONS[keyof typeof ACTIONS];

// Définition des ressources
const RESOURCES = {
    USERS: 'users',
    AUDIT: 'audit',
} as const;

type Resource = typeof RESOURCES[keyof typeof RESOURCES];

// Génération des permissions CRUD pour une ressource
const generateCrudPermissions = (resource: Resource): string[] => {
    return Object.values(ACTIONS).map(action => `${action}:${resource}`);
};

// Génération de toutes les permissions possibles
const ALL_PERMISSIONS: string[] = [
    ...generateCrudPermissions(RESOURCES.USERS),
    'read:audit',
    'manage:system',
];

// Définition des permissions par rôle
const ROLE_PERMISSIONS = {  
    admin: ALL_PERMISSIONS,
    user: [
        'read:users',
        'update:users',
    ],
    none: []
} as const;

type Role = keyof typeof ROLE_PERMISSIONS;

// Fonction utilitaire pour vérifier si une permission est valide
const isValidPermission = (permission: string): boolean => {
    return ALL_PERMISSIONS.includes(permission) || permission === 'read:audit' || permission === 'read:scheduler';
};

// Fonction utilitaire pour obtenir les permissions d'un rôle
const getPermissionsForRole = (role: Role): string[] => {
    return Array.from(ROLE_PERMISSIONS[role] || []);
};

export {
    ACTIONS,
    RESOURCES,
    ALL_PERMISSIONS,
    ROLE_PERMISSIONS,
    isValidPermission,
    getPermissionsForRole
}; 