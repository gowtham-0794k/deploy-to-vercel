import { NextResponse } from "next/server";

import User from "../../../../../lib/models/User";
import clientPromise from "../../../../../lib/db";

export async function POST(request: Request) {
  try {
    await clientPromise;
    const { email, firstName, lastName, course, states } = await request.json();
    if (!firstName || !lastName || !course || !states) {
      return NextResponse.json(
        { error: "Fill All the fields" },
        { status: 400 }
      );
    }
    const user = await User.findOne({ email }, { timeout: 30000 });
    user.firstName = firstName;
    user.lastName = lastName;
    user.course = course;
    user.isVerified = true;
    user.registrationComplete = true;
    user.states = states;
    user.emailOtp = undefined;
    user.mobileOtp = undefined;
    user.otpExpiresAt = undefined;
    await user.save();
    return NextResponse.json({
      user: user,
      message: "Registration completed successfully.",
    });
  } catch (error) {
    console.error("Complete Registration Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
