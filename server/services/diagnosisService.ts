import diagnoses from '../data/diagnoses';
import { Diagnosis } from '../types/diagnosis';

export const getDiagnoses = (): Diagnosis[] => {
  return diagnoses;
};

// 👇 Export as a single object
const diagnosesService = {
  getDiagnoses,
};

export default diagnosesService;
