import { Schema, model } from "mongoose";

export interface TarifSubscriptionModel {
    type: string; // "mensuel", "trimestriel", "semestriel" ou "annuel"
    price: number;
    durationInMonths: number; // pour calculer la date de fin de l'abonnement
}

const tarifSubscriptionSchema = new Schema<TarifSubscriptionModel>({
    type: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    durationInMonths: { type: Number, required: true }
});

export const TarifSubscriptionModel = model<TarifSubscriptionModel>("TarifSubscription", tarifSubscriptionSchema);
