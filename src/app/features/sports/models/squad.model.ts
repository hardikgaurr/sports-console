export interface SquadMember {
  id: string;
  organisationId: string;
  userId: string;
  position: string;
  agreementEnd: string | null;
  displayName: string;
  photoUrl: string | null;
  age: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface SquadMemberPayload {
  userId: string;
  position: string;
  agreementEnd: string | null;
}

/** Minimal user shape returned by GET /api/users, for the squad picker */
export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: string;
}
