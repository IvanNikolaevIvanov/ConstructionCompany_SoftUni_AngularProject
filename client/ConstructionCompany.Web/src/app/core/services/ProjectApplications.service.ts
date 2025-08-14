import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ApplicationUserModel,
  ProjectApplicationModel,
  SupervisorFeedbackModel,
} from 'app/models';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { PagedResult } from '../interfaces/PageResult';

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

  // Supervisor
  GetSupervisorApplicationsByStatus(
    statusId: number,
  ): Observable<ProjectApplicationModel[]> {
    return this.http.get<ProjectApplicationModel[]>(
      `${this.apiUrl}/GetSupervisorApplicationsByStatus/${statusId}`,
    );
  }

  printApplication(appId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/PrintApplication/${appId}`, {
      responseType: 'blob',
    });
  }

  returnApplication(appId: number, feedbackText: string): Observable<number> {
    return this.http.post<number>(
      `${this.apiUrl}/ReturnApplication/${appId}`,
      JSON.stringify(feedbackText),
      { headers: { 'Content-Type': 'application/json' } },
    );
  }

  approveApplication(appId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/ApproveApplication/${appId}`);
  }

  getAllApplicationsByStatus(
    statusId: number,
    page: number,
    size: number,
  ): Observable<PagedResult<ProjectApplicationModel>> {
    return this.http.get<PagedResult<ProjectApplicationModel>>(
      `${this.apiUrl}/GetAllApplicationsByStatus/${statusId}/${page}/${size}`,
    );
  }
}
