import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProjectApplicationModel } from '../../models';

@Injectable({ providedIn: 'root' })
export class ProjectApplicationsService {
  private apiUrl = 'https://localhost:5001/api';

  constructor(private httpClient: HttpClient) {}

  getAllProjectApplications(): Observable<ProjectApplicationModel[]> {
    return this.httpClient.get<ProjectApplicationModel[]>(
      `${this.apiUrl}/Application`
    );
  }
}
