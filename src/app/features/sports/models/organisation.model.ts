export interface Organisation {
  id: string;
  name: string;
  type: string;
  crestUrl: string | null;
  country: string | null;
  governingBodyId: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Payload accepted by POST /api/organisations and PATCH /api/organisations/:id */
export interface OrganisationPayload {
  name: string;
  type: string;
  crestUrl: string | null;
  country: string | null;
  governingBodyId: string | null;
}
