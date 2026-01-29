/* eslint-disable @typescript-eslint/no-unused-vars */
import "express-serve-static-core";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: string;
      email: string;
    };
  }
}
