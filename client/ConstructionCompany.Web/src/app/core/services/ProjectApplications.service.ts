import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ApplicationUserModel,
  ProjectApplicationModel,
  SupervisorFeedbackModel,
} from 'app/models';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApplicationService {
  private apiUrl = `http://localhost:5247/api/application`;

  constructor(private http: HttpClient) {}

  //Agent
  createApplication(formData: FormData): Observable<ProjectApplicationModel> {
    return this.http.post<ProjectApplicationModel>(
      `${this.apiUrl}/Create`,
      formData,
    );
  }

  // getApplications(): Observable<any[]> {
  //   return this.http.get<any[]>(this.apiUrl);
  // }

  // getCreatedApps(): Observable<ProjectApplicationModel[]> {
  //   return this.http.get<ProjectApplicationModel[]>(
  //     `${this.apiUrl}/GetCreatedApplications`,
  //   );
  // }

  // getSubmittedApps(): Observable<ProjectApplicationModel[]> {
  //   return this.http.get<ProjectApplicationModel[]>(
  //     `${this.apiUrl}/GetSubmittedApplications`,
  //   );
  // }

  getApplicationsByStatus(
    statusId: number,
  ): Observable<ProjectApplicationModel[]> {
    return this.http.get<ProjectApplicationModel[]>(
      `${this.apiUrl}/GetApplicationsByStatus/${statusId}`,
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

  deleteApplication(id: number): Observable<ServerResponse> {
    return this.http.delete<ServerResponse>(`${this.apiUrl}/${id}`);
  }

  getSupervisors(): Observable<ApplicationUserModel[]> {
    return this.http.get<ApplicationUserModel[]>(
      `${this.apiUrl}/GetSupervisors`,
    );
  }

  submitApplication(
    appId: number,
    supervisorId: string,
  ): Observable<ServerResponse> {
    return this.http.post<ServerResponse>(
      `${this.apiUrl}/SubmitApplication/${appId}`,
      JSON.stringify(supervisorId),
      { headers: { 'Content-Type': 'application/json' } },
    );
  }

  getFeedbacksByApplication(
    applicationId: number,
  ): Observable<SupervisorFeedbackModel[]> {
    return this.http.get<SupervisorFeedbackModel[]>(
      `${this.apiUrl}/GetFeedbacksByApplicationId/${applicationId}`,
    );
  }
}
