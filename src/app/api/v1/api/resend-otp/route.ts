import { NextResponse } from "next/server";
import dbConnect from "../../../../../lib/db";
import User from "../../../../../lib/models/User";
import { generateOTP } from "../../../../../utils/otp";

export async function POST(request: Request) {
  try {
    const { email, type } = await request.json();
    if (!email || !type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    await dbConnect();
    let user = null;
    if (type === "email") {
      user = await User.findOne({ email });
    } else if (type === "mobile") {
      user = await User.findOne({ mobileNumber: email });
    }
    if (!user) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    const updates: any = {};
    let message = "";
    if (type === "email" || type === "both") {
      const emailOtp = generateOTP();
      updates.emailOtp = emailOtp;
      message += "OTP resent to email. ";
    }
    if (type === "mobile" || type === "both") {
      const mobileOtp = generateOTP();
      updates.mobileOtp = mobileOtp;
      message += "OTP resent to mobile.";
    }
    updates.otpCreatedAt = new Date();
    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id },
      { $set: updates },
      { new: true }
    );
    return NextResponse.json({ user: updatedUser, message: message.trim() });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
