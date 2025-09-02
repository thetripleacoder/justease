import { Entry } from '../../types/patient';
import { LocalHospital, Work, Favorite } from '@mui/icons-material';

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

export const EntryDetails = ({ entry }: { entry: Entry }) => {
  switch (entry.type) {
    case 'Hospital':
      return (
        <div>
          <LocalHospital />
          <p>
            Discharge: {entry.discharge.date} - {entry.discharge.criteria}
          </p>
        </div>
      );
    case 'OccupationalHealthcare':
      return (
        <div>
          <Work />
          <p>Employer: {entry.employerName}</p>
          <p>
            Sick Leave: {entry.sickLeave?.startDate} -{' '}
            {entry.sickLeave?.endDate}
          </p>
        </div>
      );
    case 'HealthCheck':
      return (
        <div>
          <Favorite
            style={{
              color:
                entry.healthCheckRating === 0
                  ? 'green'
                  : entry.healthCheckRating === 1
                  ? 'yellow'
                  : entry.healthCheckRating === 2
                  ? 'orange'
                  : 'red',
            }}
          />
        </div>
      );
    default:
      return assertNever(entry);
  }
};
