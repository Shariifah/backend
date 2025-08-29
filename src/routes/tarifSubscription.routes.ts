import express, { Router } from "express";
import tarifSubscriptionController from "../controllers/tarifSubscription.controller";
import {
    validateCreateTarifSubscriptionData
} from "../middlewares/validationMiddleware";

const router: Router = express.Router();

/**
 * Créer un tarif d'abonnement
 */
router.post("/create-tarif", validateCreateTarifSubscriptionData, tarifSubscriptionController.createTarifSubscription.bind(tarifSubscriptionController));

/**
 * Récupérer tous les tarifs
 */
router.get("/findAll", tarifSubscriptionController.getAllTarifSubscriptions.bind(tarifSubscriptionController));

/**
 * Récupérer un tarif par type

 */
router.get("/findByType/:type", tarifSubscriptionController.getTarifSubscriptionByType.bind(tarifSubscriptionController));

/**
 * Mettre à jour un tarif
 */
router.patch("/update-tarif/:id", validateCreateTarifSubscriptionData, tarifSubscriptionController.updateTarifSubcription.bind(tarifSubscriptionController));

/**
 * Supprimer un tarif
 */
router.delete("/delete-tarif/:id", tarifSubscriptionController.deleteTarifSubscription.bind(tarifSubscriptionController));

export default router;
