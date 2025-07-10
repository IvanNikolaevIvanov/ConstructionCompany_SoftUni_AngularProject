import { ApplicationUserModel } from './ApplicationUser.model';

export interface SupervisorFeedbackModel {
  id: number;
  content: string;
  createdAt: string;
  supervisorId: string;
  supervisor: ApplicationUserModel;
}
