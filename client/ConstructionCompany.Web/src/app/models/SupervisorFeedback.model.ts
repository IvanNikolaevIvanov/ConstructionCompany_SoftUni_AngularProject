import { ApplicationUserModel } from './ApplicationUser.model';

export interface SupervisorFeedbackModel {
  id: number;
  text: string;
  createdAt: string;
  applicationId: number;
  authorId: string; // supervisor id
  authorName: string; // supervisor name
}
