import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApplicationService {
  constructor(private http: HttpClient) {}

  createApplication(formData: FormData): Observable<any> {
    return this.http.post(`/api/Application`, formData, {
      withCredentials: true,
    });
  }

  // getApplications(): Observable<any[]> {
  //   return this.http.get<any[]>(this.apiUrl);
  // }
}
