import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environment/environment';
import { ApiResponse } from '../../interfaces/public/api-response.interface';

interface FileUploadResponse {
  url: string;
}

@Injectable({ providedIn: 'root' })
export class StorageServiceVid {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/api/Storage`;

  //sube una imagen y retorna la URL de Cloudinary
  uploadImage(file: File): Observable<string> {
    const form = new FormData();
    form.append('file', file);
    return this.http
      .post<ApiResponse<FileUploadResponse>>(`${this.base}/image`, form)
      .pipe(map(r => r.data.url));
  }
}