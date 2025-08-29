import { Request, Response } from "express";
import { TarifSubscriptionService } from "../services/tarifSubscription.service";
import { sendSuccess, sendError } from "../utils/responseHandler";
enum SubscriptionType {
    MENSUEL = 'mensuel',
    TRIMESTRIEL = 'trimestriel',
    SEMESTRIEL = 'semestriel',
    ANNUEL = 'annuel'
}

class TarifSubscriptionController  {

    // Créer un tarif
    async createTarifSubscription(req: Request, res: Response) {

        try {
            const { type, price } = req.body;

            if (!type || !price) {
                throw new Error("type et price sont requis");
            }

            const validTypes = Object.values(SubscriptionType);
            if (!validTypes.includes(type)) {
                throw new Error(`Type d'abonnement non valide. Types acceptés: ${validTypes.join(', ')}`);
            }

            const subscriptionType = type as SubscriptionType;

            const typeToDuration: { [key in SubscriptionType]: number } = {
                [SubscriptionType.MENSUEL]: 1,
                [SubscriptionType.TRIMESTRIEL]: 3,
                [SubscriptionType.SEMESTRIEL]: 6,
                [SubscriptionType.ANNUEL]: 12
            };

            const durationInMonths = typeToDuration[subscriptionType];

            const tarif = await TarifSubscriptionService.createTarifSubscription(
                subscriptionType,
                price,
                durationInMonths
            );

            sendSuccess(res, tarif, "Tarif d'abonnement créé avec succès.", 201);
        } catch (error) {
            sendError(res, error);
        }
    };

    // Récupérer tous les tarifs
    async getAllTarifSubscriptions(req: Request, res: Response) {
        try {
            const tarifs = await TarifSubscriptionService.getAllTarifSubscriptions();
            sendSuccess(res, tarifs, "Liste des tarifs récupérée.");
        } catch (error) {
            sendError(res, error);
        }
    };

    // Récupérer un tarif par type
    async getTarifSubscriptionByType(req: Request, res: Response) {
        try {
            const { type } = req.params;
            const tarif = await TarifSubscriptionService.getTarifSubscrition(type);
            sendSuccess(res, tarif, `Tarif trouvé pour le type: ${type}`);
        } catch (error) {
            sendError(res, error);
        }
    };

    // Modifier un tarif
    async updateTarifSubcription(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const updates = req.body;

            const tarif = await TarifSubscriptionService.updateTarifSubscription(id, updates);
            sendSuccess(res, tarif, "Tarif mis à jour avec succès.");
        } catch (error) {
            sendError(res, error);
        }
    };

    // Supprimer un tarif
    async deleteTarifSubscription(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const deleted = await TarifSubscriptionService.deleteTarifSubscription(id);
            sendSuccess(res, deleted, "Tarif supprimé avec succès.");
        } catch (error) {
            sendError(res, error);
        }
    }
}
export default new TarifSubscriptionController();