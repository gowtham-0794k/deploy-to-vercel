import axios from "axios";

export default class SmsService {
  static async sendSmsOtp(
    mobileNumber: string,
    templateId: string,
    var1: string
  ): Promise<void> {
    const authKey = `${process.env.MSG91_AUTH_KEY}`;
    const url = "https://control.msg91.com/api/v5/flow";

    const requestBody = {
      template_id: templateId,
      recipients: [
        {
          mobiles: `91${mobileNumber}`,
          var1: var1,
        },
      ],
    };

    const headers = {
      authkey: authKey,
      accept: "application/json",
      "content-type": "application/json",
    };

    try {
      const response = await axios.post(url, requestBody, { headers });
      if (response.data.type === "success") {
      } else {
        throw new Error(response.data.message || "OTP sending failed.");
      }
    } catch (error) {
      console.log(`Error sending OTP to ${mobileNumber}:`, error);
      throw error;
    }
  }
}
