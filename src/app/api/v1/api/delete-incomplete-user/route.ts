import { NextResponse } from "next/server";
import dbConnect from "../../../../../lib/db";
import User from "../../../../../lib/models/User";

function validateEmail(email: string) {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function validateMobileNumber(mobileNumber: string) {
  const re = /^[0-9]{10}$/;
  return re.test(String(mobileNumber));
}

export async function DELETE(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    await dbConnect();

    const query: any = {
      isVerified: false,
    };

    if (validateEmail(email)) {
      query.email = email;
    } else if (validateMobileNumber(email)) {
      query.mobileNumber = email;
    } else {
      return NextResponse.json(
        { error: "Invalid email or mobile number" },
        { status: 400 }
      );
    }

    const result = await User.deleteOne(query);

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "User not found or already deleted." },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "User deleted successfully." });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
