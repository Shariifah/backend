import express from "express";
import {
    validateCreateSubscriptionData,
    validateUpdatePaymentStatusData
} from "../middlewares/validationMiddleware";
import subscriptionController from "../controllers/subscription.controller";

const router = express.Router();
/**
 * Créer un abonnement + paiement
 */
router.post("/create-subscription", validateCreateSubscriptionData, subscriptionController.createSubscription.bind(subscriptionController));

/**
 * Récupérer les abonnements d'un utilisateur
 */
router.get("/findByUser/:userId", subscriptionController.getUserSubscriptions.bind(subscriptionController));

/**
 * Récupérer un abonnement par ID
 */
router.get("/findById/:id", subscriptionController.getSubscriptionById.bind(subscriptionController));

/**
 *  Annuler un abonnement
 */
router.delete("/delete-subscription:id", subscriptionController.deleteSubscrption.bind(subscriptionController));

/**
 * Mettre à jour le statut d’un paiement
 */
router.patch("/:subscriptionId/status", validateUpdatePaymentStatusData, subscriptionController.updatePaymentStatus.bind(subscriptionController));

/**
 * Simuler un paiement
 */
router.post("/simulate", subscriptionController.simulatePayment.bind(subscriptionController));


export default router;
