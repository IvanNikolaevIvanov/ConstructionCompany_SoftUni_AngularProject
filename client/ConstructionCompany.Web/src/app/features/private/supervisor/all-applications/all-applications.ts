import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCard, MatCardModule } from '@angular/material/card';
import { SliceDescriptionPipe } from 'app/shared/pipes';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { ProjectApplicationModel } from 'app/models';
import { ApplicationService, AuthService } from 'app/core/services';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ApplicationStatus } from 'app/enums/enums';
import { MatTabsModule } from '@angular/material/tabs';
import { CreateFeedback } from '../create-feedback/create-feedback';
import { CustomSnackbar } from '../../agent/custom-snackbar/custom-snackbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';

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
    MatPaginatorModule,
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
    'status',
    'agentName',
    'supervisorName',
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

  pageSize: number = 5;
  pageIndex: number = 0;
  totalItems: number = 0;

  @ViewChild('applicationsSort') applicationsSort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private appService: ApplicationService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    const state = history.state;

    if (state && state.status !== undefined) {
      // Restore previous state if coming back from details page
      this.pageIndex = state.pageIndex ?? 0;
      this.pageSize = state.pageSize ?? 5;
      this.status = state.status;
      this.selectedRow = state.application ?? undefined;
    }

    this.loadTables(state.application?.id);
  }

  ngAfterViewInit(): void {
    this.applicationsDataSource.sort = this.applicationsSort;
    // this.applicationsDataSource.paginator = this.paginator;
  }

  onStatusChange(newStatus: ApplicationStatus) {
    this.status = newStatus;
    this.pageIndex = 0;
    this.paginator.firstPage();
    this.loadTables();
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.loadTables(); // fetch or slice data accordingly
  }

  // onPageSizeSelection(newSize: number) {
  //   this.pageSize = newSize;
  //   this.pageIndex = 0; // Reset to first page
  //   setTimeout(() => {
  //     this.paginator.firstPage();
  //   }); // Ensure paginator reflects the change
  //   this.paginator._changePageSize(newSize); // Refresh paginator properly
  // }

  loadTables(selectedAppId?: number) {
    this.isLoading = true;
    console.log(
      `Selected Status is: ${ApplicationStatus[this.status].toString()}`,
    );
    this.appService
      .getAllApplicationsByStatus(
        this.status,
        this.pageIndex + 1,
        this.pageSize,
      )
      .subscribe({
        next: (res) => {
          this.applicationsDataSource.data = res.items;
          this.totalItems = res.totalCount;
          // this.pageSize = res.pageSize;
          // this.pageIndex = res.page - 1;

          console.log(`Page index is: ${this.pageIndex}`);
          console.log(`Page size is: ${this.pageSize}`);
          console.log(`Total Items count is: ${this.totalItems}`);
          console.log(`Current Items count is: ${res.items.length}`);

          //Check if total items have decreased and reset paginator if necessary
          // if (res.items.length < this.pageSize * this.pageIndex) {
          //   this.pageIndex = 0;
          //   this.paginator.firstPage();
          // }

          if (selectedAppId) {
            this.selectedRow = res.items.find(
              (app) => app.id === selectedAppId,
            );
          }

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

  isSupervisor(app: ProjectApplicationModel): boolean {
    const currentUserId = this.authService.userId;
    return app.supervisorId === currentUserId();
  }

  viewDetails() {
    this.router.navigate(['supervisor/application-details'], {
      state: {
        from: 'allApplications',
        application: this.selectedRow,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        status: this.status,
      },
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
            this.loadTables();
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
        this.loadTables();
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
