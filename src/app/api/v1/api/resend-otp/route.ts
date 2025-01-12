// import { NextResponse } from "next/server";
// import dbConnect from "../../../../../lib/db";
// import User from "../../../../../lib/models/User";
// import { generateOTP } from "../../../../../utils/otp";
// import { sendEmail } from "shared/services/email";
// import SmsService from "shared/services/mobileOtp";

// export async function POST(request: Request) {
//   try {
//     const { email, type } = await request.json();
//     if (!email || !type) {
//       return NextResponse.json(
//         { error: "Missing required fields" },
//         { status: 400 }
//       );
//     }
//     await dbConnect();
//     let user = null;
//     if (type === "email") {
//       user = await User.findOne({ email });
//     } else if (type === "mobile") {
//       user = await User.findOne({ mobileNumber: email });
//     }
//     if (!user) {
//       return NextResponse.json({ error: "Invalid email" }, { status: 400 });
//     }
//     const updates: any = {};
//     let message = "";
//     if (type === "email" || type === "both") {
//       const emailOtp = generateOTP();
//       updates.emailOtp = emailOtp;
//       message += "OTP resent to email. ";
//     }
//     if (type === "mobile" || type === "both") {
//       const mobileOtp = generateOTP();
//       updates.mobileOtp = mobileOtp;
//       message += "OTP resent to mobile.";
//     }
//     updates.otpCreatedAt = new Date();
//     const updatedUser = await User.findOneAndUpdate(
//       { _id: user._id },
//       { $set: updates },
//       { new: true }
//     );
//     // Send OTP via email
//     if(type === 'email'){
//       await sendEmail(
//         email,
//         "Email OTP",
//         `<p>Your OTP is: <strong>${updates.emailOtp}</strong></p>`
//       );
//     }
//     // Send OTP via SMS
//     if(type === 'mobile'){
//       const templateId = process.env.MSG91_TEMPLATE_ID;
//     await SmsService.sendSmsOtp(updatedUser.mobileNumber, templateId!, updates.mobileOtp);
//     }
//     return NextResponse.json({ user: updatedUser, message: message.trim() });
//   } catch (error) {
//     console.error("Error:", error);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";
import dbConnect from "../../../../../lib/db";
import User from "../../../../../lib/models/User";
import { generateOTP } from "../../../../../utils/otp";
import { sendEmail } from "shared/services/email";
import SmsService from "shared/services/mobileOtp";

export async function POST(request: Request) {
  try {
    const { email, type } = await request.json();
    if (!email || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await dbConnect();

    const query = type === "email" ? { email } : { mobileNumber: email };
    const user = await User.findOne(query);

    if (!user) {
      return NextResponse.json({ error: "Invalid user" }, { status: 400 });
    }

    const updates: Record<string, any> = { otpCreatedAt: new Date() };
    const otpTypes = type === "both" ? ["email", "mobile"] : [type];

    for (const otpType of otpTypes) {
      const otp = generateOTP();
      updates[`${otpType}Otp`] = otp;
      
      if (otpType === "email") {
        await sendEmail(email, "Email OTP", `<p>Your OTP is: <strong>${otp}</strong></p>`);
      } else if (otpType === "mobile") {
        await SmsService.sendSmsOtp(user.mobileNumber, process.env.MSG91_TEMPLATE_ID!, otp);
      }
    }

    await User.findByIdAndUpdate(user._id, { $set: updates });

    return NextResponse.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error in resend OTP:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}