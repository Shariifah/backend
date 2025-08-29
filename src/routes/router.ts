import express from "express";
const router = express.Router();


import authRoutes from "./auth.routes";
import subscriptionRoutes from "./subscription.routes";
import tarifSubscriptionRoutes from "../routes/tarifSubscription.routes";
import subjectRoutes from "../routes/subject.routes";
import publicationRoutes from "../routes/publicationSubject.routes";
import questionRoutes from "../routes/question.routes";
import userAnswerRoutes from "../routes/userAnswer.routes";


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
router.use("/api/subscription", subscriptionRoutes);
router.use("/api/tarifSubscription", tarifSubscriptionRoutes);
router.use("/api/subject", subjectRoutes);
router.use("/api/publication", publicationRoutes);
router.use("/api/question", questionRoutes);
router.use("/api/userAnswer", userAnswerRoutes);


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
