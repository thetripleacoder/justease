/* eslint-disable @typescript-eslint/no-unused-vars */
import patients from '../data/patients';
import { NewPatient, NonSensitivePatient, Patient } from '../types/patient';
import { v1 as uuid } from 'uuid';

const getPatients = (): Patient[] => {
  return patients;
};

const getNonSensitivePatients = (): NonSensitivePatient[] => {
  return patients.map(({ ssn, ...rest }) => rest);
};

const addPatient = (patient: NewPatient): Patient => {
  const newPatient: Patient = {
    id: uuid(),
    ...patient,
  };
  patients.push(newPatient);
  return newPatient;
};

const getPatientById = (id: string): Patient | undefined => {
  return patients.find((p) => p.id === id);
};

// 👇 Export as a single object
const patientService = {
  getNonSensitivePatients,
  addPatient,
  getPatientById,
  getPatients,
};

export default patientService;
