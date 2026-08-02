export interface GoverningBody {
  id: string;
  sportId: string;
  name: string;
  country: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Payload accepted by POST /api/governing-bodies and PATCH /api/governing-bodies/:id */
export interface GoverningBodyPayload {
  sportId: string;
  name: string;
  country: string | null;
}
