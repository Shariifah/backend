import Subscription, { SubscriptionDocument } from "../models/subscription.model";
import { SubscriptionType, PaymentStatus } from "../types/types";
import { Types } from "mongoose";

class SubscriptionService {

    async createSubscription(userId: Types.ObjectId, type: SubscriptionType, transactionId: string, startDate: Date, endDate: Date,  price: number
    ) {
        const subscription = new Subscription({userId, type,
            paymentStatus: "paid", transactionId, startDate, endDate, price
        });
        return subscription.save();
    }

    async updatePaymentStatus(id: string, status: PaymentStatus, transactionId?: string) {
        return Subscription.findByIdAndUpdate(id, { paymentStatus: status, transactionId }, { new: true });
    }

    async getSubscriptionsByUser(userId: string) {
        return Subscription.find({ userId }).sort({ createdAt: -1 });
    }

    async getById(id: string) {
        return Subscription.findById(id);
    }

    async cancelSubscription(id: string) {
        const sub = await Subscription.findById(id);
        if (!sub) return null;
        sub.paymentStatus = "failed";
        await sub.save();
        return sub;
    }

    getPrice(type: SubscriptionType): number {
        const prices: Record<SubscriptionType, number> = {
            mensuel: 5000,
            trimestriel: 14000,
            semestriel: 27000,
            annuel: 50000
        };
        return prices[type];
    }
}

export default new SubscriptionService();
