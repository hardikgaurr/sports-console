import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { Observable } from 'rxjs';

import { environment } from '../../../../environment/environment';

export interface UploadResponse {
  url: string;
}

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  private readonly http = inject(HttpClient);

  private readonly baseUrl = `${environment.apiUrl}/uploads/image`;

  /**
   * Uploads an image to the backend.
   *
   * Endpoint:
   * POST /api/uploads/image
   *
   * Body:
   * multipart/form-data
   * field name: "file"
   *
   * Returns:
   * { url: string }
   */
  uploadImage(file: File): Observable<UploadResponse> {
    const formData = new FormData();

    formData.append('file', file);

    return this.http.post<UploadResponse>(this.baseUrl, formData);
  }
}
