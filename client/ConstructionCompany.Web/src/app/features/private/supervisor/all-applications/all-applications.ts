import {
  AfterViewInit,
  Component,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCard, MatCardModule } from '@angular/material/card';
import { SliceDescriptionPipe } from 'app/shared/pipes';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { ProjectApplicationModel } from 'app/models';
import { ApplicationService } from 'app/core/services';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ApplicationStatus } from 'app/enums/enums';
import { MatTabsModule } from '@angular/material/tabs';
import { CreateFeedback } from '../create-feedback/create-feedback';
import { CustomSnackbar } from '../../agent/custom-snackbar/custom-snackbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'all-applications',
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    SliceDescriptionPipe,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './all-applications.html',
  styleUrl: './all-applications.scss',
})
export class AllApplications implements OnInit, AfterViewInit {
  displayedApplicationsColumns: string[] = [
    'title',
    'clientName',
    'description',
    'price',
    'clientBank',
    'actions',
  ];

  statusList = [
    { value: ApplicationStatus.Created, label: 'Created' },
    { value: ApplicationStatus.Submitted, label: 'Submitted' },
    {
      value: ApplicationStatus.ReturnedBySupervisor,
      label: 'Returned By Supervisor',
    },
    { value: ApplicationStatus.Approved, label: 'Approved' },
    { value: ApplicationStatus.All, label: 'All' },
  ];

  status: ApplicationStatus = ApplicationStatus.Submitted;

  isLoading = false;

  applicationsDataSource = new MatTableDataSource<ProjectApplicationModel>([]);
  selectedRow?: ProjectApplicationModel;

  @ViewChild('applicationsSort') applicationsSort!: MatSort;

  constructor(
    private appService: ApplicationService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.loadTables(this.status);
  }

  ngAfterViewInit(): void {
    // Assign MatSort after the view is initialized
    this.applicationsDataSource.sort = this.applicationsSort;
  }

  onStatusChange(newStatus: ApplicationStatus) {
    this.status = newStatus;
    this.loadTables(newStatus);
  }

  loadTables(status: ApplicationStatus) {
    this.isLoading = true;
    console.log(`Selected Status is: ${ApplicationStatus[status].toString()}`);
    this.appService.getAllApplicationsByStatus(status).subscribe({
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

  onRowClick(row: ProjectApplicationModel) {
    this.selectedRow = row;

    console.log(`Selected row is: ${this.selectedRow}`);
  }
  viewDetails() {
    this.router.navigate(['supervisor/application-details'], {
      state: { application: this.selectedRow },
    });
  }

  returnWithFeedback() {
    const dialogRef = this.dialog.open(CreateFeedback);
    dialogRef.afterClosed().subscribe((feedbackText) => {
      if (!feedbackText) {
        return;
      }
      console.log('Feedback text:', feedbackText);
      this.appService
        .returnApplication(this.selectedRow!.id, feedbackText)
        .subscribe({
          next: (res) => {
            this.snackBar.openFromComponent(CustomSnackbar, {
              data: {
                message: `Application was returned with feedback: ${res}`,
                type: 'success',
              },
              duration: 3000,
              panelClass: ['custom-snackbar'],
              horizontalPosition: 'center',
              verticalPosition: 'top',
            });
            this.loadTables(this.status);
          },
          error: (err) => {
            this.snackBar.openFromComponent(CustomSnackbar, {
              data: {
                message: err.error?.message || 'Failed to return feedback',
                type: 'error',
              },
              duration: 3000,
              panelClass: ['custom-snackbar'],
              horizontalPosition: 'center',
              verticalPosition: 'top',
            });
          },
        });
    });
  }

  approve(appId: number) {
    console.log('Approve clicked for id:', appId);
    this.appService.approveApplication(appId).subscribe({
      next: (res) => {
        this.snackBar.openFromComponent(CustomSnackbar, {
          data: {
            message: `Application was approved!`,
            type: 'success',
          },
          duration: 3000,
          panelClass: ['custom-snackbar'],
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        this.selectedRow = undefined;
        this.loadTables(this.status);
      },
      error: (err) => {
        this.snackBar.openFromComponent(CustomSnackbar, {
          data: {
            message: err.error?.message || 'Failed to approve application',
            type: 'error',
          },
          duration: 3000,
          panelClass: ['custom-snackbar'],
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      },
    });
  }
}
