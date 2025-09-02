import { z } from 'zod';
import { Gender } from '../types/patient';

export const NewPatientSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  dateOfBirth: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid date format',
  }),
  ssn: z.string().min(1, 'SSN is required'),
  gender: z.nativeEnum(Gender),
  occupation: z.string().min(1, 'Occupation is required'),
});

export type NewPatient = z.infer<typeof NewPatientSchema>;
