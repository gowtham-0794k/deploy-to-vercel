// import { NextResponse } from "next/server";
// import dbConnect from "../../../../../lib/db";

// import User from "../../../../../lib/models/User";
// import { generateOTP } from "../../../../../utils/otp";
// import bcrypt from "bcryptjs";
// import { sendEmail } from "shared/services/email";
// import SmsService from "shared/services/mobileOtp";

// export async function POST(request: Request) {
//   try {
//     await dbConnect();
//     const { email, password, mobileNumber, isdCode } = await request.json();
//     if (!email || !password || !mobileNumber || !isdCode) {
//       return NextResponse.json(
//         { error: "Missing required fields" },
//         { status: 400 }
//       );
//     }

//     // Check if user already exists
//     const existingUser = await User.findOne({
//       $or: [{ email }, { mobileNumber }],
//     });
//     let errorMessage = "";
//     if (existingUser) {
//       if (
//         existingUser.email === email &&
//         existingUser.mobileNumber === mobileNumber
//       ) {
//         errorMessage = "User with this email and mobile already";
//       } else if (existingUser.email === email) {
//         errorMessage = "User with this email already exists.";
//       } else {
//         errorMessage = "User with this mobile already exists.";
//       }
//       return NextResponse.json({ error: errorMessage }, { status: 409 });
//     }

//     // Hash the password and generate OTPs
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const emailOtp = generateOTP();
//     const mobileOtp = generateOTP();
//     const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

//     // Create a new user
//     const newUser = new User({
//       email,
//       password: hashedPassword,
//       mobileNumber,
//       isdCode,
//       emailOtp,
//       mobileOtp,
//       isVerified: false,
//       otpExpiresAt,
//       registrationComplete: false,
//       role: "student",
//     });

//     await newUser.save();

//     // Send OTP via email
//     await sendEmail(
//       email,
//       "Email OTP",
//       `<p>Your OTP is: <strong>${emailOtp}</strong></p>`
//     );

//     // Send OTP via SMS
//     const templateId = process.env.MSG91_TEMPLATE_ID;
//     await SmsService.sendSmsOtp(mobileNumber, templateId!, mobileOtp);

//     return NextResponse.json({
//       user: newUser,
//       message: "OTPs sent to email and mobile.",
//     });
//   } catch (error) {
//     console.error("Registration Error:", error);
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
import bcrypt from "bcryptjs";
import { sendEmail } from "shared/services/email";
import SmsService from "shared/services/mobileOtp";
export async function POST(request: Request) {
  try {
    await dbConnect();
    const { email, password, mobileNumber, isdCode } = await request.json();

    if (!email || !password || !mobileNumber || !isdCode) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { mobileNumber }] });

    // if (existingUser) {
    //   if (existingUser.is_verified === "Yes") {
    //     let errorMessage;
    //     if (existingUser.email === email && existingUser.mobileNumber === mobileNumber) {
    //       errorMessage = "User with this email and mobile already exists.";
    //     } else if (existingUser.email === email) {
    //       errorMessage = "User with this email already exists.";
    //     } else {
    //       errorMessage = "User with this mobile already exists.";
    //     }
    //     return NextResponse.json({ error: errorMessage }, { status: 409 });
    //   } else {
    //     // Delete the existing unverified user
    //     console.log("deleting unverified user");
    //     await User.findByIdAndDelete(existingUser._id);
    //   }
    // }

    if (existingUser) {
      if (existingUser.isVerified === true) {
        let errorMessage;
        if (existingUser.email === email && existingUser.mobileNumber === mobileNumber) {
          errorMessage = "User with this email and mobile already exists.";
        } else if (existingUser.email === email) {
          errorMessage = "User with this email already exists.";
        } else {
          errorMessage = "User with this mobile already exists.";
        }
        return NextResponse.json({ error: errorMessage }, { status: 409 });
      } else {
        // Delete the existing unverified user
        console.log("deleting unverified user");
        await User.findByIdAndDelete(existingUser._id);
      }
    }

    // Hash password and generate OTPs
    const [hashedPassword, emailOtp, mobileOtp] = await Promise.all([
      bcrypt.hash(password, 10),
      generateOTP(),
      generateOTP()
    ]);

    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Create and save new user
    const newUser = await User.create({
      email,
      password: hashedPassword,
      mobileNumber,
      isdCode,
      emailOtp,
      mobileOtp,
      is_verified: "No",
      otpExpiresAt,
      registrationComplete: false,
      role: "student",
    });

    // Send OTPs
    await Promise.all([
      sendEmail(email, "Email OTP", `<p>Your OTP is: <strong>${emailOtp}</strong></p>`),
      SmsService.sendSmsOtp(mobileNumber, process.env.MSG91_TEMPLATE_ID!, mobileOtp)
    ]);

    return NextResponse.json({
      user: newUser,
      message: "OTPs sent to email and mobile.",
    });
  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}