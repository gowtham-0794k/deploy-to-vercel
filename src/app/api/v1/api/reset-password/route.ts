import { NextResponse } from "next/server";
import dbConnect from "../../../../../lib/db";
import User from "../../../../../lib/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  const { token, newPassword } = await req.json();
  if (!token || !newPassword) {
    return NextResponse.json(
      { error: "Token and new password are required." },
      { status: 400 }
    );
  }
  try {
    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET ?? "default-secret"
    );
    const email = decoded.email;
    await dbConnect();
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid token or user not found." },
        { status: 404 }
      );
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    return NextResponse.json({
      message: "Password has been reset successfully.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid or expired token." },
      { status: 400 }
    );
  }
}
