import {TarifSubscriptionModel} from "../models/tarifSubscription.model";

export const TarifSubscriptionService = {

    // Créer un nouveau tarif
    async createTarifSubscription(type: string, price: number, durationInMonths: number) {
        // Vérifier si le type existe déjà
        const existingTarif = await TarifSubscriptionModel.findOne({ type });
        if (existingTarif) {
            throw new Error(`Un tarif pour le type "${type}" existe déjà`);
        }

        const tarif = new TarifSubscriptionModel({
            type,
            price,
            durationInMonths
        });
        return tarif.save();
    },

    // Récupérer un tarif par type
    async getTarifSubscrition(type: string) {
        const tarif = await TarifSubscriptionModel.findOne({ type });
        if (!tarif) throw new Error(`Aucun tarif trouvé pour le type: ${type}`);
        return tarif;
    },

    // Modifier un tarif existant
    async updateTarifSubscription(id: string, updates: Partial<{ type: string, price: number, durationInMonths: number }>) {
        const tarif = await TarifSubscriptionModel.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true }
        );
        if (!tarif) throw new Error(`Aucun tarif trouvé avec l'ID: ${id}`);
        return tarif;
    },

    // Supprimer un tarif
    async deleteTarifSubscription(id: string) {
        const deletedTarif = await TarifSubscriptionModel.findByIdAndDelete(id);
        if (!deletedTarif) throw new Error(`Aucun tarif trouvé avec l'ID: ${id}`);
        return deletedTarif;
    },

    // Récupérer tous les tarifs
    async getAllTarifSubscriptions() {
        return TarifSubscriptionModel.find();
    }
};
