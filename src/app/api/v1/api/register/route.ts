import { NextResponse } from "next/server";
import dbConnect from "../../../../../lib/db";

import User from "../../../../../lib/models/User";
import { generateOTP } from "../../../../../utils/otp";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { email, password, mobileNumber, isdCode } = await request.json();
    if (!email || !password || !mobileNumber || !isdCode) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    const existingUser = await User.findOne({
      $or: [{ email }, { mobileNumber }],
    });
    let errorMessage = "";
    if (existingUser) {
      if (
        existingUser.email === email &&
        existingUser.mobileNumber === mobileNumber
      ) {
        errorMessage = "User with this email and mobile already";
      } else if (existingUser.email === email) {
        errorMessage = "User with this email already exists.";
      } else {
        errorMessage = "User with this mobile already exists.";
      }
      return NextResponse.json({ error: errorMessage }, { status: 409 });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const emailOtp = generateOTP();
    const mobileOtp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    const newUser = new User({
      email,
      password: hashedPassword,
      mobileNumber,
      isdCode,
      emailOtp,
      mobileOtp,
      isVerified: false,
      otpExpiresAt,
      registrationComplete: false,
      role: "student",
    });
    await newUser.save();
    // Send OTP via email
    // await sendEmail(
    //   email,
    //   'Email OTP',
    //   `<p>Your OTP is: <strong>${emailOtp}</strong></p>`
    // );
    // // Send OTP via different method
    // const savedUser = await newUser.save();
    //send verification email otp
    // await sendEmail({email, userId.savedUser._id})
    // TODO: Send mobile OTP via SMS
    return NextResponse.json({
      user: newUser,
      message: "OTPs sent to email and mobile.",
    });
  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
