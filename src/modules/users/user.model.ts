import mongoose, { InferSchemaType } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
  },
  { timestamps: true },
);

// userSchema.set("toJSON", {
//   transform: (_doc, ret) => {
//     delete ret.passwordHash;
//     return ret;
//   },
// });

userSchema.methods.toJSON = function () {
  const { passwordHash, ...user } = this.toObject();
  return user;
};


export type User = InferSchemaType<typeof userSchema>;

export const UserModel = mongoose.model<User>("User", userSchema);
