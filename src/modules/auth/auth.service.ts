import bcrypt from "bcryptjs";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { env } from "../../shared/env";
import { HttpError } from "../../shared/HttpError";
import { UserModel } from "../users/user.model";

type RegisterInput = {
  fullName: string;
  email: string;
  password: string;
};

type LoginInput = {
  email: string;
  password: string;
};

// function signToken(payload: { id: string; email: string }) {
//   return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
// }

function signToken(payload: { id: string; email: string }) {
  // env.JWT_EXPIRES_IN is a plain string from process.env, but jsonwebtoken types expect:
  // expiresIn: number | ms.StringValue
  const secret: Secret = env.JWT_SECRET;

  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
  };

  return jwt.sign(payload, secret, options);
}

async function register(input: RegisterInput) {
  const existing = await UserModel.findOne({ email: input.email });
  if (existing) throw new HttpError(409, "Email already in use");

  const passwordHash = await bcrypt.hash(input.password, env.BCRYPT_SALT_ROUNDS);

  const userDoc = await UserModel.create({
    fullName: input.fullName,
    email: input.email,
    passwordHash,
  });

  const user = userDoc.toJSON();
  const token = signToken({ id: userDoc._id.toString(), email: userDoc.email });

  return { user, token };
}

async function login(input: LoginInput) {
  const userDoc = await UserModel.findOne({ email: input.email }).select("+passwordHash");
  if (!userDoc) throw new HttpError(401, "Invalid email or password");

  const ok = await bcrypt.compare(input.password, userDoc.passwordHash);
  if (!ok) throw new HttpError(401, "Invalid email or password");

  const user = userDoc.toJSON();
  const token = signToken({ id: userDoc._id.toString(), email: userDoc.email });

  return { user, token };
}

export const authService = { register, login };
