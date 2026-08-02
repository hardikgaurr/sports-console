export type StaffCategory = 'club_president' | 'executive_management' | 'operations_administration';

export interface Staff {
  id: string;
  organisationId: string;
  name: string;
  roleTitle: string;
  category: StaffCategory;
  nationality: string | null;
  photoUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface StaffPayload {
  name: string;
  roleTitle: string;
  category: StaffCategory;
  nationality: string | null;
  photoUrl: string | null;
}
