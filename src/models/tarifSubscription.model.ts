import { Schema, model } from "mongoose";
import {SubscriptionType} from "../types/types";

export interface TarifSubscriptionModel {
    type: SubscriptionType;
    price: number;
    durationInMonths: number; // pour calculer la date de fin de l'abonnement
}

const tarifSubscriptionSchema = new Schema<TarifSubscriptionModel>({
    type: { type: String, enum: ["mensuel", "trimestriel", "semestriel", "annuel"], required: true, unique: true },
    price: { type: Number, required: true },
    durationInMonths: { type: Number, required: true }
});

export const TarifSubscriptionModel = model<TarifSubscriptionModel>("TarifSubscription", tarifSubscriptionSchema);
