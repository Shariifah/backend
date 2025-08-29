import mongoose, { Schema, Document, Model } from "mongoose";
import { SubscriptionType, PaymentStatus } from "../types/types";
import {TarifSubscriptionModel} from "../models/tarifSubscription.model";

export interface SubscriptionDocument extends Document {
    userId: mongoose.Types.ObjectId;
    type: SubscriptionType;
    price: number;
    startDate: Date;
    endDate: Date;
    paymentStatus: PaymentStatus;
    transactionId?: string;
    createdAt: Date;
    updatedAt: Date;
}

const SubscriptionSchema = new Schema<SubscriptionDocument>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        type: { type: String, enum: ["mensuel", "trimestriel", "semestriel", "annuel"], required: true },
        price: { type: Number, required: true },
        startDate: { type: Date, default: Date.now },
        endDate: { type: Date },
        paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
        transactionId: { type: String }
    },
    { timestamps: true }
);

// Middleware pour calculer la date de fin d'abonnement automatiquement
SubscriptionSchema.pre("save", async function (next) {

        if (this.isNew || this.isModified("type")) {
            // Récupérer le tarif correspondant
            const tarif = await TarifSubscriptionModel.findOne({ type: this.type });
            if (!tarif) {
                return next(new Error(`Aucun tarif trouvé pour le type : ${this.type}`));
            }

            // Affecter le prix automatiquement
            this.price = tarif.price;

            // Calculer la date de fin en fonction de durationInMonths
            if (!this.startDate) {
                this.startDate = new Date();
            }
            const endDate = new Date(this.startDate);
            endDate.setMonth(endDate.getMonth() + tarif.durationInMonths);
            this.endDate = endDate;
        }

        next();
    });

const Subscription: Model<SubscriptionDocument> = mongoose.model<SubscriptionDocument>("Subscription", SubscriptionSchema);

export default Subscription;
