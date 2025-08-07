import {
  AfterViewInit,
  Component,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProjectApplicationModel } from 'app/models';
import { ApplicationService } from 'app/core/services';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { forkJoin } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'agent-dashboard',
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './agent-dashboard.html',
  styleUrls: ['./agent-dashboard.scss'],
})
export class AgentDashboard implements OnInit, AfterViewInit {
  displayedCreatedColumns: string[] = [
    'title',
    'clientName',
    'description',
    'price',
    'clientBank',
    'actions',
  ];

  displayedSubmittedColumns: string[] = [
    'title',
    'clientName',
    'price',
    'submittedAt',
    'supervisorId',
  ];

  createdDataSource = new MatTableDataSource<ProjectApplicationModel>([]);
  submittedDataSource = new MatTableDataSource<ProjectApplicationModel>([]);

  @ViewChild('createdSort') createdSort!: MatSort;
  @ViewChild('submittedSort') submittedSort!: MatSort;

  isLoading = false;

  constructor(
    private appService: ApplicationService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadTables();
  }

  ngAfterViewInit(): void {
    // Assign MatSort after the view is initialized
    this.createdDataSource.sort = this.createdSort;
    this.submittedDataSource.sort = this.submittedSort;
  }

  loadTables() {
    this.isLoading = true;

    forkJoin({
      created: this.appService.getCreatedApps(),
      submitted: this.appService.getSubmittedApps(),
    }).subscribe({
      next: ({ created, submitted }) => {
        this.createdDataSource.data = created;
        this.submittedDataSource.data = submitted;

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error Loading applications', err);
        this.isLoading = false;
      },
    });
  }

  editApplication(id: number) {
    // Navigate or handle edit
  }

  deleteApplication(id: number) {
    this.isLoading = true;
    // this.appService.deleteApp(id).subscribe(() => this.loadTables());
  }

  submitApplication(id: number) {
    this.isLoading = true;
    // this.appService.submitApp(id).subscribe(() => this.loadTables());
  }
}
