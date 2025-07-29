import express from "express";
const router = express.Router();


import authRoutes from "./auth.routes";


// Route racine
router.all('/', (req, res, next) => { 
    res.json({
        'service'     : 'BOURGEON API',
        'status'      : 'online',
        'version'     : '1.0.0',
        'environment' : process.env.NODE_ENV || 'development',
        'server_time' : new Date().toISOString(),
        'description' : 'Bienvenue dans l\'API Bourgeon'
    }) 
});



router.use("/api/auth", authRoutes);

// Middleware pour gérer les routes non trouvées (404)
router.use((req, res, next) => {
    res.status(404).json({
        success: false,
        error: 'Route introuvable',
        path: req.originalUrl,
        method: req.method
    });
});


export default router;
