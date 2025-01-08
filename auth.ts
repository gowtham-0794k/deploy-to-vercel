import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import dbConnect from "./src/lib/db";
import User from "./src/lib/models/User";
import bcrypt from "bcryptjs";
import * as Yup from "yup";

const credentialsSchema = Yup.object().shape({
  email: Yup.string()
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$|^\+?[0-9]{10,15}$/,
      "Please enter a valid email or phone number"
    )
    .required("Email/Phone is required"),
  password: Yup.string().max(255).required("Password is required"),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        await credentialsSchema.validate(credentials);

        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        await dbConnect();
        //call the backend api
        const user = await User.findOne({
          $or: [{ email }, { mobileNumber: email }],
        });

        //return the user in the response

        if (!user) {
          throw new Error("Invalid credentials");
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
          throw new Error("Invalid credentials");
        }
        return user;
      },
    }),
  ],
});
