import { Component, OnInit } from '@angular/core';
import { ApplicationService } from 'app/core/services';
import { ApplicationUserModel } from 'app/models';
import { Observable } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'select-supervisor',
  imports: [CommonModule, MatButtonModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './select-supervisor.html',
  styleUrl: './select-supervisor.scss',
})
export class SelectSupervisor implements OnInit {
  supervisors$!: Observable<ApplicationUserModel[]>;
  selectedSupervisor?: ApplicationUserModel;

  constructor(
    private appService: ApplicationService,
    public dialogRef: MatDialogRef<SelectSupervisor>,
  ) {}

  ngOnInit(): void {
    this.supervisors$ = this.appService.getSupervisors();
  }

  onSelect() {
    this.dialogRef.close(this.selectedSupervisor?.id);
  }

  onCancel() {
    this.dialogRef.close();
  }
}
