// eslint-disable @typescript-eslint/no-unsafe-assignment
// eslint-disable @typescript-eslint/no-unsafe-call
// eslint-disable @typescript-eslint/no-unsafe-member-access
// eslint-disable @typescript-eslint/no-explicit-any
// eslint-disable @typescript-eslint/no-unused-vars

import { NextFunction, Request, Response } from 'express';
import { NewPatientSchema } from '../schemas/patientSchema';
import { NewPatient } from '../types/patient';

export const toNewPatient = (object: unknown): NewPatient => {
  const result = NewPatientSchema.parse(object);

  return result;
};

export const newPatientParser = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    NewPatientSchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};
