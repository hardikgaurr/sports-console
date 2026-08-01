export interface Participant {
  id: string;

  organisationId: string;

  name: string;

  role: string;

  avatar?: string;

  jerseyNumber?: number;

  nationality?: string;

  dateOfBirth?: string;

  createdAt: string;

  updatedAt: string;
}
