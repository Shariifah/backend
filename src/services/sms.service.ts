export const sendSMS = async (phonenumber: string, message: string) => {
  console.log(`Sending SMS to ${phonenumber}: ${message}`);
};

export default {
  sendSMS
};