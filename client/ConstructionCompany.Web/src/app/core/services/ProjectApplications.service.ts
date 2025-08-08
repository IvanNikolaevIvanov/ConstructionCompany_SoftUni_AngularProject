import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProjectApplicationModel } from 'app/models';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApplicationService {
  private apiUrl = `http://localhost:5247/api/application`;

  constructor(private http: HttpClient) {}

  //Agent
  createApplication(formData: FormData): Observable<ProjectApplicationModel> {
    return this.http.post<ProjectApplicationModel>(`${this.apiUrl}`, formData);
  }

  // getApplications(): Observable<any[]> {
  //   return this.http.get<any[]>(this.apiUrl);
  // }

  getCreatedApps(): Observable<ProjectApplicationModel[]> {
    return this.http.get<ProjectApplicationModel[]>(
      `${this.apiUrl}/GetCreatedApplications`,
    );
  }

  getSubmittedApps(): Observable<ProjectApplicationModel[]> {
    return this.http.get<ProjectApplicationModel[]>(
      `${this.apiUrl}/GetSubmittedApplications`,
    );
  }

  getApplicationById(id: number): Observable<ProjectApplicationModel> {
    return this.http.get<ProjectApplicationModel>(
      `${this.apiUrl}/GetApplicationById/${id}`,
    );
  }

  updateApplication(id: number, formData: FormData): Observable<number> {
    return this.http.post<number>(
      `${this.apiUrl}/UpdateApplication/${id}`,
      formData,
    );
  }
}
