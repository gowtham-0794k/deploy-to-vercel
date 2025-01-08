import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "../../../../../lib/models/User";
import dbConnect from "../../../../../lib/db";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const { email, password } = await request.json();
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "User does not exist with this email. Please sign up first." },
        { status: 404 }
      );
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const tokenData = {
      id: user._id,
      username: user.firstname + " " + user.lastname,
      email: user.email,
    };
    const token = await jwt.sign(tokenData, process.env.JWT_SECRET as string);

    const response = NextResponse.json(
      {
        message: "Login successful",
        success: true,
      },
      { status: 200 }
    );
    response.cookies.set("token", token, {
      httpOnly: true,
    });

    return response;
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}