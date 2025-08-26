import { Request, Response } from "express";
import SubscriptionService from "../services/subscription.service";
import PaymentService from "../services/payment.service";
import { sendSuccess, sendError } from "../utils/responseHandler";
import {TarifSubscriptionService} from "../services/tarifSubscription.service";
import SubscriptionModel from "../models/subscription.model";

class SubscriptionController {

    // Création d'un abonnement

    async createSubscription(req: Request, res: Response) {
        try {
            const { userId, type, phoneNumber } = req.body;

            if (!userId || !type || !phoneNumber) {
                throw new Error("userId, type et phoneNumber sont requis");
            }

            // Récupérer le tarif dynamique depuis tarifSubscription
            const tarif = await TarifSubscriptionService.getTarifSubscrition(type);
            if (!tarif) {
                throw new Error(`Aucun tarif trouvé pour le type: ${type}`);
            }

            // Vérifier s'il existe un abonnement actif ou le plus récent
            const lastSubscription = await SubscriptionModel.findOne({ userId })
                .sort({ endDate: -1 })
                .exec();

            let startDate = new Date();

            if (lastSubscription && lastSubscription.endDate > new Date()) {

                startDate = new Date(lastSubscription.endDate);
                startDate.setDate(startDate.getDate() + 1);
            }

            const endDate = new Date(startDate);
            endDate.setMonth(endDate.getMonth() + tarif.durationInMonths);


            // Vérifier le paiement avant toute création
            const paymentResult = await PaymentService.simulatePayment(tarif.price, phoneNumber);

            if (!paymentResult.success || !paymentResult.transactionId) {
                return sendError(res, new Error("Échec du paiement"));
            }

            // Créer la souscription après paiement confirmé
            const subscription = await SubscriptionService.createSubscription(
                userId,
                type,
                paymentResult.transactionId,
                startDate,
                endDate,
                tarif.price

            );

            sendSuccess(res, subscription, "Abonnement créé et payé avec succès ✅", 201);
        } catch (error) {
            sendError(res, error);
        }
    }

    // Récupérer les abonnements d'un utilisateur
    async getUserSubscriptions(req: Request, res: Response) {
        try {
            const { userId } = req.params;

            if (!userId) {
                throw new Error("userId requis");
            }

            const subscriptions = await SubscriptionService.getSubscriptionsByUser(userId);

            sendSuccess(res, subscriptions, "Liste des abonnements récupérée avec succès", 200);

        } catch (error) {
            sendError(res, error);
        }
    }

    // Récupérer un abonnement par ID
    async getSubscriptionById(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const subscription = await SubscriptionService.getById(id);
            if (!subscription) {
                throw new Error("Abonnement introuvable");
            }

            sendSuccess(res, subscription, "Abonnement récupéré avec succès", 200);

        } catch (error) {
            sendError(res, error);
        }
    }

    // Annuler un abonnement
    async deleteSubscrption(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const cancelled = await SubscriptionService.cancelSubscription(id);
            if (!cancelled) {
                throw new Error("Impossible d'annuler l'abonnement");
            }

            sendSuccess(res, {}, "Abonnement annulé avec succès", 200);

        } catch (error) {
            sendError(res, error);
        }
    }

    /**
     * Mettre à jour le statut du paiement d’un abonnement
     * PATCH /payments/:subscriptionId/status
     */
    async updatePaymentStatus(req: Request, res: Response) {
        try {
            const { subscriptionId } = req.params;
            const { status, transactionId } = req.body;

            if (!status) {
                throw new Error("Le champ 'status' est requis");
            }

            const updated = await SubscriptionService.updatePaymentStatus(
                subscriptionId,
                status,
                transactionId
            );

            if (!updated) {
                throw new Error("Impossible de mettre à jour le statut du paiement");
            }

            sendSuccess(res, updated, "Statut du paiement mis à jour avec succès ✅", 200);
        } catch (error) {
            sendError(res, error);
        }
    }

    /**
     * Simuler un paiement
     * POST /payments/simulate
     */
    async simulatePayment(req: Request, res: Response) {
        try {
            const { amount, phoneNumber } = req.body;

            if (!amount || !phoneNumber) {
                throw new Error("Montant et numéro de téléphone requis");
            }

            const paymentResult = await PaymentService.simulatePayment(amount, phoneNumber);

            sendSuccess(res, paymentResult, "Paiement simulé avec succès", 200);
        } catch (error) {
            sendError(res, error);
        }
    }

}

export default new SubscriptionController();
