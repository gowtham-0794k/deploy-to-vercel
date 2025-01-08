import { NextResponse } from "next/server";
import dbConnect from "../../../../../lib/db";

import jwt from "jsonwebtoken";
import User from "../../../../../lib/models/User";
import { sendEmail } from "../../../../../shared/services/email";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

export async function POST(req: Request) {
  const { email } = await req.json();
  // Validate the email
  if (!email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }
  // Connect to the database
  await dbConnect();
  // Find the user by email
  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json(
      { error: "No user found with this email." },
      { status: 404 }
    );
  }
  // Generate a reset token (valid for 1 hour)
  const token = jwt.sign(
    { email: user.email },
    process.env.JWT_SECRET ?? "default-secret",
    { expiresIn: "1h" }
  );
  // Create the reset password link
  const resetLink = `${BASE_URL}/reset-password?token=${token}`;
  // Send the reset link via email
  await sendEmail(
    user.email,
    "Reset Password",
    `Click the link to reset your password: ${resetLink}`
  );
  return NextResponse.json({
    message: "Reset password link has been sent to your email.",
  });
}
