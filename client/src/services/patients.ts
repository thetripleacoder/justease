import axios from 'axios';
import { EntryWithoutId, Patient, PatientFormValues } from '../types/patient';

import { apiBaseUrl } from '../constants';

const getAll = async () => {
  const { data } = await axios.get<Patient[]>(`${apiBaseUrl}/patients`);

  return data;
};

const create = async (object: PatientFormValues) => {
  const { data } = await axios.post<Patient>(`${apiBaseUrl}/patients`, object);

  return data;
};

const getOne = async (id: string) => {
  const { data } = await axios.get<Patient>(`${apiBaseUrl}/patients/${id}`);
  return data;
};

const addEntry = async (id: string, entry: EntryWithoutId) => {
  const { data } = await axios.post<Patient>(
    `${apiBaseUrl}/patients/${id}/entries`,
    entry
  );
  return data;
};

export default {
  getAll,
  create,
  getOne,
  addEntry,
};
