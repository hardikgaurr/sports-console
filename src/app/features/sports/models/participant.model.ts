export interface Participant {
  id: string;
  organisationId: string;
  name: string;
  role: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Payload accepted by POST /api/participants and PATCH /api/participants/:id */
export interface ParticipantPayload {
  organisationId: string;
  name: string;
  role: string | null;
}
