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
import { SliceDescriptionPipe } from 'app/shared/pipes';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialog } from 'app/features/private/agent/confirm-dialog/confirm-dialog';
import { CustomSnackbar } from 'app/features/private/agent/custom-snackbar/custom-snackbar';
import { SelectSupervisor } from '../select-supervisor/select-supervisor';

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
    SliceDescriptionPipe,
  ],
  providers: [SliceDescriptionPipe],
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
    'supervisorName',
  ];

  createdDataSource = new MatTableDataSource<ProjectApplicationModel>([]);
  submittedDataSource = new MatTableDataSource<ProjectApplicationModel>([]);

  selectedRow: ProjectApplicationModel | null = null;
  selectedTable: 'created' | 'submitted' | null = null;

  @ViewChild('createdSort') createdSort!: MatSort;
  @ViewChild('submittedSort') submittedSort!: MatSort;

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

  onRowClick(row: ProjectApplicationModel, table: 'created' | 'submitted') {
    this.selectedRow = row;
    this.selectedTable = table;
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
