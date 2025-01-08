// lib/models/TempLogin.ts
import mongoose, { Document, Schema } from "mongoose";

export interface ITempLogin extends Document {
  userId: mongoose.Types.ObjectId;
  email: string;
  password: string;
}

const TempLoginSchema = new Schema<ITempLogin>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    email: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const TempLogin =
  mongoose.models.TempLogin ||
  mongoose.model<ITempLogin>("TempLogin", TempLoginSchema);
export default TempLogin;
