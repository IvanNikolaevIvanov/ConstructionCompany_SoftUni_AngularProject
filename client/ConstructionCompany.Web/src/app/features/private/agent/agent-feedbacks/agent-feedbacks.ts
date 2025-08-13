import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { ApplicationService } from 'app/core/services';
import { ProjectApplicationModel, SupervisorFeedbackModel } from 'app/models';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog';
import { CustomSnackbar } from '../custom-snackbar/custom-snackbar';
import { SelectSupervisor } from '../select-supervisor/select-supervisor';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SliceDescriptionPipe } from 'app/shared/pipes';
import { Observable } from 'rxjs';
import { ApplicationStatus } from 'app/enums/enums';
import { FeedbackComponent } from '../feedback-component/feedback-component';

@Component({
  selector: 'agent-feedbacks',
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatCard,
    MatIconModule,
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    SliceDescriptionPipe,
  ],
  providers: [SliceDescriptionPipe],
  templateUrl: './agent-feedbacks.html',
  styleUrl: './agent-feedbacks.scss',
})
export class AgentFeedbacks implements OnInit {
  displayedApplicationsColumns: string[] = [
    'title',
    'clientName',
    'description',
    'submittedAt',
    'actions',
  ];

  applicationsDataSource = new MatTableDataSource<ProjectApplicationModel>([]);
  feedbacksDataSource = new MatTableDataSource<SupervisorFeedbackModel>([]);
  isFeedbacksLoading = false;
  selectedRow: ProjectApplicationModel | null = null;
  selectedFeedback?: SupervisorFeedbackModel;
  selectedApplication?: ProjectApplicationModel;
  @ViewChild('applicationsSort') applicationsSort!: MatSort;
  isLoading = false;

  constructor(
    private appService: ApplicationService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.loadTables();
  }

  loadTables() {
    this.isLoading = true;

    this.appService
      .getApplicationsByStatus(ApplicationStatus.ReturnedBySupervisor)
      .subscribe({
        next: (res) => {
          this.applicationsDataSource.data = res;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error Loading applications', err);
          this.isLoading = false;
        },
      });
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

  ngAfterViewInit(): void {
    // Assign MatSort after the view is initialized
    this.applicationsDataSource.sort = this.applicationsSort;
  }

  onRowClick(row: ProjectApplicationModel) {
    this.selectedRow = row;
    this.loadFeedbacks(row.id);
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

  editApplication(id: number) {
    this.router.navigate(['/agent/application-form', id]);
  }

  deleteApplication(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: {
        title: 'Confirm Deletion',
        message: 'Are you sure you want to delete this application?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.appService.deleteApplication(id).subscribe({
          next: (res) => {
            this.snackBar.openFromComponent(CustomSnackbar, {
              data: { message: res.message, type: 'success' },
              duration: 3000,
              panelClass: ['custom-snackbar'],
              horizontalPosition: 'right',
              verticalPosition: 'top',
            });
            this.loadTables();
          },
          error: (err) => {
            this.snackBar.openFromComponent(CustomSnackbar, {
              data: {
                message: err.error?.message || 'Failed to delete application',
                type: 'error',
              },
              duration: 3000,
              panelClass: ['custom-snackbar'],
              horizontalPosition: 'right',
              verticalPosition: 'top',
            });
          },
        });
      }
    });
  }

  submitApplication(id: number) {
    const dialogRef = this.dialog.open(SelectSupervisor);
    dialogRef.afterClosed().subscribe((selected) => {
      if (selected) {
        console.log('Supervisor selected:', selected);
        this.appService.submitApplication(id, selected).subscribe({
          next: (res) => {
            this.snackBar.openFromComponent(CustomSnackbar, {
              data: { message: res.message, type: 'success' },
              duration: 3000,
              panelClass: ['custom-snackbar'],
              horizontalPosition: 'right',
              verticalPosition: 'top',
            });
            this.loadTables();
          },
          error: (err) => {
            this.snackBar.openFromComponent(CustomSnackbar, {
              data: {
                message: err.error?.message || 'Failed to submit application',
                type: 'error',
              },
              duration: 3000,
              panelClass: ['custom-snackbar'],
              horizontalPosition: 'right',
              verticalPosition: 'top',
            });
          },
        });
      }
    });
  }
}
