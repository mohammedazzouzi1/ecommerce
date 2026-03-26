import mongoose, { Document, Model, Schema } from "mongoose";

export interface IAdminActivity extends Document {
  adminUsername: string;
  action: string;
  status: "success" | "failed";
  ipAddress?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

const AdminActivitySchema = new Schema<IAdminActivity>(
  {
    adminUsername: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    action: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["success", "failed"],
      required: true,
    },
    ipAddress: {
      type: String,
      default: "",
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const AdminActivity: Model<IAdminActivity> =
  mongoose.models.AdminActivity ||
  mongoose.model<IAdminActivity>("AdminActivity", AdminActivitySchema);

export default AdminActivity;

