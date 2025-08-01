
class SmsService {

  // 🔹 Envoi d'un SMS
  async sendSMS(phonenumber: string, message: string) {
    console.log(`Sending SMS to ${phonenumber}: ${message}`);
  }

}

export default new SmsService();