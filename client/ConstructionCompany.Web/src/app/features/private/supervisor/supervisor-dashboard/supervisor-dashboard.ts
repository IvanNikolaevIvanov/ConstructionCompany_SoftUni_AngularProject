import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCard, MatCardModule } from '@angular/material/card';
import { SliceDescriptionPipe } from 'app/shared/pipes';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { ProjectApplicationModel, SupervisorFeedbackModel } from 'app/models';
import { ApplicationService } from 'app/core/services';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ApplicationStatus } from 'app/enums/enums';
import { FeedbackComponent } from '../../agent/feedback-component/feedback-component';

@Component({
  selector: 'supervisor-dashboard',
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    SliceDescriptionPipe,
  ],
  templateUrl: './supervisor-dashboard.html',
  styleUrl: './supervisor-dashboard.scss',
})
export class SupervisorDashboard implements OnInit, AfterViewInit {
  displayedApplicationsColumns: string[] = [
    'title',
    'clientName',
    'description',
    'price',
    'clientBank',
    'actions',
  ];

  isLoading = false;
  isFeedbacksLoading = false;

  applicationsDataSource = new MatTableDataSource<ProjectApplicationModel>([]);
  feedbacksDataSource = new MatTableDataSource<SupervisorFeedbackModel>([]);

  selectedRow?: ProjectApplicationModel;
  selectedFeedback?: SupervisorFeedbackModel;
  selectedApplication?: ProjectApplicationModel;

  @ViewChild('applicationsSort') applicationsSort!: MatSort;

  constructor(
    private appService: ApplicationService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.loadTables();
  }

  ngAfterViewInit(): void {
    // Assign MatSort after the view is initialized
    this.applicationsDataSource.sort = this.applicationsSort;
  }

  loadTables() {
    this.isLoading = true;

    this.appService
      .GetSupervisorApplicationsByStatus(ApplicationStatus.Submitted)
      .subscribe({
        next: (res) => {
          this.applicationsDataSource.data == res;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error Loading applications', err);
          this.isLoading = false;
        },
      });
  }

  onRowClick(row: ProjectApplicationModel) {
    this.selectedRow = row;
    this.loadFeedbacks(row.id);
  }

  loadFeedbacks(applicationId: number) {
    this.isFeedbacksLoading = true;
    this.appService.getFeedbacksByApplication(applicationId).subscribe({
      next: (res) => {
        this.feedbacksDataSource.data = res;
        this.isFeedbacksLoading = false;
      },
      error: (err) => {
        console.error('Error loading feedbacks', err);
        this.isFeedbacksLoading = false;
      },
    });
  }

  onFeedbackClick(row: SupervisorFeedbackModel) {
    this.selectedFeedback = row;
    const dialogRef = this.dialog.open(FeedbackComponent, {
      data: {
        author: this.selectedFeedback.authorName ?? '',
        message: this.selectedFeedback.text ?? '',
        date: this.selectedFeedback.createdAt ?? '',
      },
    });
  }

  viewDetails(appId: number) {}

  returnWithFeedback(appId: number) {}

  approve(appId: number) {}
}
