import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  email: string;
  password?: string;
  mobileNumber?: string;
  isdCode?: string;
  firstName?: string;
  lastName?: string;
  course?: string;
  emailOtp?: string;
  mobileOtp?: string;
  isVerified?: boolean;
  otpExpiresAt?: Date;
  registrationComplete?: boolean;
  invitationToken?: string;
  invitationExpiresAt?: Date;
  invitedByTenantId?: string;
  role?: string;
  createdAt: Date;
  states?: string;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true },
    password: String,
    mobileNumber: String,
    isdCode: String,
    firstName: String,
    lastName: String,
    course: String,
    emailOtp: String,
    mobileOtp: String,
    isVerified: { type: Boolean, default: false },
    otpExpiresAt: Date,
    registrationComplete: { type: Boolean, default: false },
    invitationToken: String,
    invitationExpiresAt: Date,
    invitedByTenantId: String,
    role: { type: String, default: "student" },
    createdAt: { type: Date, default: Date.now },
    states: String,
  },
  { timestamps: true }
);

const User =
  mongoose.models.users || mongoose.model<IUser>("users", UserSchema);

export default User;
