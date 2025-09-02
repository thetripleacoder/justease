/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorResponse, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Diagnosis } from '../types/diagnosis';
import { EntryWithoutId, Patient } from '../types/patient';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import TransgenderIcon from '@mui/icons-material/Transgender';
import patientService from '../services/patients';
import diagnosesService from '../services/diagnoses';
import { EntryDetails } from '../components/PatientDetailPage/EntryDetails';
import axios from 'axios';
import { AddEntryForm } from '../components/PatientDetailPage/AddEntryForm';

type EntryFormData = {
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes: string[];
  type: 'HealthCheck' | 'Hospital' | 'OccupationalHealthcare';
  healthCheckRating?: number;
  dischargeDate?: string;
  dischargeCriteria?: string;
  employerName?: string;
  sickLeaveStart?: string;
  sickLeaveEnd?: string;
};

export const PatientDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [formData, setFormData] = useState<EntryFormData>({
    description: '',
    date: '',
    specialist: '',
    diagnosisCodes: [],
    type: 'HealthCheck',
    healthCheckRating: 0,
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatient = async () => {
      if (!id) return;
      const patientData = await patientService.getOne(id);
      setPatient(patientData);
    };
    const fetchDiagnoses = async () => {
      const diagnosesData = await diagnosesService.getAll();
      setDiagnoses(diagnosesData);
    };

    fetchPatient();
    fetchDiagnoses();
  }, [id]);

  const getGenderIcon = (gender: string): JSX.Element => {
    switch (gender) {
      case 'male':
        return <MaleIcon />;
      case 'female':
        return <FemaleIcon />;
      default:
        return <TransgenderIcon />;
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Registry-driven entry builders
    const entryBuilders: Record<any, () => EntryWithoutId> = {
      HealthCheck: () => ({
        type: 'HealthCheck',
        description: formData.description,
        date: formData.date,
        specialist: formData.specialist,
        diagnosisCodes: formData.diagnosisCodes,
        healthCheckRating: formData.healthCheckRating ?? 0,
      }),
      Hospital: () => ({
        type: 'Hospital',
        description: formData.description,
        date: formData.date,
        specialist: formData.specialist,
        diagnosisCodes: formData.diagnosisCodes,
        discharge: {
          date: formData.dischargeDate ?? '',
          criteria: formData.dischargeCriteria ?? '',
        },
      }),
      OccupationalHealthcare: () => ({
        type: 'OccupationalHealthcare',
        description: formData.description,
        date: formData.date,
        specialist: formData.specialist,
        diagnosisCodes: formData.diagnosisCodes,
        employerName: formData.employerName ?? '',
        ...(formData.sickLeaveStart && formData.sickLeaveEnd
          ? {
              sickLeave: {
                startDate: formData.sickLeaveStart,
                endDate: formData.sickLeaveEnd,
              },
            }
          : {}),
      }),
    };

    // Type guard for structured error response
    const isStructuredError = (
      data: unknown
    ): data is { error: ErrorResponse[] } => {
      console.log(
        'isStructuredError',
        data,
        typeof data === 'object' &&
          data !== null &&
          'error' in data &&
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          Array.isArray((data as any).error)
      );
      return (
        typeof data === 'object' &&
        data !== null &&
        'error' in data &&
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Array.isArray((data as any).error)
      );
    };

    try {
      const builder = entryBuilders[formData.type];
      console.log('builder', builder);
      if (!builder) throw new Error('Unsupported entry type');

      const entry = builder();
      const updatedPatient = await patientService.addEntry(patient!.id, entry);
      setPatient(updatedPatient);
      setErrorMessage(null);

      // Reset form
      setFormData({
        description: '',
        date: '',
        specialist: '',
        diagnosisCodes: [],
        type: 'HealthCheck',
        healthCheckRating: 0,
      });
    } catch (error: unknown) {
      console.log(error);
      if (
        axios.isAxiosError(error) &&
        isStructuredError(error.response?.data)
      ) {
        console.log(error.response?.data);
        const errorMessage = error
          .response!.data.error.map(
            (err: any) => `Field ${err.path[0]}: ${err.message}`
          )
          .join(', ');
        setErrorMessage(errorMessage);
      } else if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Unknown error occurred');
      }

      console.error('Submission error:', {
        error,
        formData,
        patientId: patient?.id,
      });
    }
  };

  if (!patient) return <div>Loading...</div>;

  return (
    <div>
      <h2>
        {patient.name} {getGenderIcon(patient.gender)}
      </h2>
      <p>SSN: {patient.ssn}</p>
      <p>Occupation: {patient.occupation}</p>
      <p>Date of Birth: {patient.dateOfBirth}</p>

      <h3>Entries</h3>
      {!patient.entries?.length ? (
        <p>No entries yet.</p>
      ) : (
        patient.entries.map((entry) => (
          <div key={entry.id}>
            <div>
              <strong>{entry.date}</strong> <EntryDetails entry={entry} />
            </div>
            <p>{entry.description}</p>
            <p>Specialist: {entry.specialist}</p>
            {entry.diagnosisCodes && (
              <ul>
                {entry.diagnosisCodes.map((code) => {
                  const diagnosis = diagnoses.find((d) => d.code === code);
                  return (
                    <li key={code}>
                      {code} {diagnosis?.name}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        ))
      )}

      <AddEntryForm
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        errorMessage={errorMessage}
        patient={patient}
        diagnoses={diagnoses}
      />
    </div>
  );
};
