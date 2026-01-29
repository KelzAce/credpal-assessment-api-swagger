import { AnyZodObject } from "zod";
import { RequestHandler } from "express";

export const validate =
  (schema: AnyZodObject): RequestHandler =>
  (req, _res, next) => {
    schema.parse({
      body: req.body,
      params: req.params,
      query: req.query,
    });
    next();
  };
