import express, { Request, Response, NextFunction } from 'express';
import patientService from '../services/patientService';
import { v4 as uuidv4 } from 'uuid';
import patients from '../data/patients';
import { newPatientParser, toNewPatient } from '../utils/patientParser';
import { newEntryParser, toNewEntry } from '../utils/entryParser';
import z from 'zod';

const router = express.Router();

const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof z.ZodError) {
    res.status(400).send({ error: error.issues });
  } else {
    next(error);
  }
};

// router.get('/', (_req, res) => {
//   res.json(patientService.getNonSensitivePatients());
// });

router.get('/', (_req, res) => {
  res.json(patientService.getPatients());
});

router.post('/', newPatientParser, (req, res) => {
  try {
    const newPatient = toNewPatient(req.body);
    const addedPatient = patientService.addPatient(newPatient);
    res.json(addedPatient);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      res.status(400).send({ error: error.issues });
    } else {
      res.status(400).send({ error: 'unknown error' });
    }
  }
});

router.get('/:id', (req, res) => {
  const patient = patientService.getPatientById(req.params.id);
  if (patient) {
    res.json(patient);
  } else {
    res.status(404).send({ error: 'Patient not found' });
  }
});

router.post('/:id/entries', newEntryParser, (req, res) => {
  const patient = patients.find((p) => p.id === req.params.id);
  if (!patient) {
    return res.status(404).send('Patient not found');
  }

  try {
    const newEntry = toNewEntry(req.body); // validate type
    const entryWithId = { ...newEntry, id: uuidv4() };
    if (!patient.entries?.length) {
      patient.entries = [];
    }
    patient.entries.push(entryWithId);
    return res.json(patient);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return res.status(400).send({ error: error });
    }
    return res.status(400).send({ error: 'unknown error' });
  }
});

router.use(errorMiddleware);

export default router;
