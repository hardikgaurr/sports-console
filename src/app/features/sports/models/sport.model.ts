export interface Sport {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

/** Payload accepted by POST /api/sports and PATCH /api/sports/:id */
export interface SportPayload {
  name: string;
}
