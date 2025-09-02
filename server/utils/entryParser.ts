import { NextFunction, Request, Response } from 'express';
import { NewEntry, NewEntrySchema } from '../schemas/entrySchema';

// utils/entryParser.ts
export const toNewEntry = (object: unknown): NewEntry => {
  return NewEntrySchema.parse(object);
};

export const newEntryParser = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    NewEntrySchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};
