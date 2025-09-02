 

import { Diagnosis } from '../../types/diagnosis';
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';
import { Patient } from '../../types/patient';

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

export const AddEntryForm: React.FC<{
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
  errorMessage: string | null;
  patient: Patient | null;
  diagnoses: Diagnosis[];
  setFormData: React.Dispatch<React.SetStateAction<EntryFormData>>;
  formData: EntryFormData;
}> = ({
  handleSubmit,
  errorMessage,
  patient,
  diagnoses,
  setFormData,
  formData,
}) => {
  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string | number>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'healthCheckRating' ? Number(value) : value,
    }));
  };

  const handleDiagnosisChange = (e: SelectChangeEvent<string[]>) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      diagnosisCodes: Array.isArray(value) ? value : value.split(','),
    }));
  };

  if (!patient) return <div>Loading...</div>;

  return (
    <div>
      <h3>Add New Entry</h3>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
      >
        <TextField
          label='Description'
          name='description'
          value={formData.description}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label='Date'
          name='date'
          type='date'
          value={formData.date}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />
        <TextField
          label='Specialist'
          name='specialist'
          value={formData.specialist}
          onChange={handleChange}
          fullWidth
        />
        <FormControl fullWidth>
          <InputLabel>Entry Type</InputLabel>
          <Select
            native
            name='type'
            value={formData.type}
            onChange={handleChange}
          >
            <option value='HealthCheck'>HealthCheck</option>
            <option value='Hospital'>Hospital</option>
            <option value='OccupationalHealthcare'>
              OccupationalHealthcare
            </option>
          </Select>
        </FormControl>

        {formData.type === 'HealthCheck' && (
          <TextField
            label='Health Check Rating'
            name='healthCheckRating'
            type='number'
            value={formData.healthCheckRating}
            onChange={handleChange}
            inputProps={{ min: 0, max: 3 }}
            fullWidth
          />
        )}

        {formData.type === 'Hospital' && (
          <>
            <TextField
              label='Discharge Date'
              name='dischargeDate'
              type='date'
              value={formData.dischargeDate || ''}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label='Discharge Criteria'
              name='dischargeCriteria'
              value={formData.dischargeCriteria || ''}
              onChange={handleChange}
              fullWidth
            />
          </>
        )}

        {formData.type === 'OccupationalHealthcare' && (
          <>
            <TextField
              label='Employer Name'
              name='employerName'
              value={formData.employerName || ''}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label='Sick Leave Start'
              name='sickLeaveStart'
              type='date'
              value={formData.sickLeaveStart || ''}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label='Sick Leave End'
              name='sickLeaveEnd'
              type='date'
              value={formData.sickLeaveEnd || ''}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </>
        )}

        <FormControl fullWidth>
          <InputLabel>Diagnosis Codes</InputLabel>
          <Select
            multiple
            value={formData.diagnosisCodes}
            onChange={handleDiagnosisChange}
            renderValue={(selected) => selected.join(', ')}
          >
            {diagnoses.map((d) => (
              <MenuItem key={d.code} value={d.code}>
                {d.code} - {d.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button type='submit' variant='contained' color='primary'>
          Add Entry
        </Button>
      </form>
    </div>
  );
};
