// utils/entryParser.ts
import { z } from 'zod';
import { HealthCheckRating } from '../types/patient';

const BaseEntrySchema = z.object({
  description: z.string().min(1),
  date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid date format',
  }),
  specialist: z.string().min(1),
  diagnosisCodes: z.array(z.string()).optional(),
});

const HealthCheckEntrySchema = BaseEntrySchema.extend({
  type: z.literal('HealthCheck'),
  healthCheckRating: z.nativeEnum(HealthCheckRating),
});

const HospitalEntrySchema = BaseEntrySchema.extend({
  type: z.literal('Hospital'),
  discharge: z.object({
    date: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: 'Invalid discharge date',
    }),
    criteria: z.string().min(1),
  }),
});

const OccupationalHealthcareEntrySchema = BaseEntrySchema.extend({
  type: z.literal('OccupationalHealthcare'),
  employerName: z.string().min(1),
  sickLeave: z
    .object({
      startDate: z.string().refine((date) => !isNaN(Date.parse(date))),
      endDate: z.string().refine((date) => !isNaN(Date.parse(date))),
    })
    .optional(),
});

export const NewEntrySchema = z.discriminatedUnion('type', [
  HealthCheckEntrySchema,
  HospitalEntrySchema,
  OccupationalHealthcareEntrySchema,
]);

export type NewEntry = z.infer<typeof NewEntrySchema>;

// Define special omit for unions
export type UnionOmit<T, K extends string | number | symbol> = T extends unknown
  ? Omit<T, K>
  : never;
// Define Entry without the 'id' property
export type EntryWithoutId = UnionOmit<NewEntry, 'id'>;
