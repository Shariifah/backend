
export default new class PaymentService {
    async simulatePayment(amount: number, phoneNumber: string): Promise<{ success: boolean; transactionId?: string }> {
        console.log(`Paiement de ${amount} FCFA vers ${phoneNumber} en cours...`);
        await new Promise(res => setTimeout(res, 2000));
        if (Math.random() < 0.8) {
            return { success: true, transactionId: "OM-" + Date.now() };
        } else {
            return { success: false };
        }
    }
};
