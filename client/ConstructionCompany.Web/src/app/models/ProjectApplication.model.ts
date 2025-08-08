import { ApplicationStatus } from '../enums/enums';
import { ApplicationFileModel } from './ApplicationFile.model';
import { ApplicationUserModel } from './ApplicationUser.model';
import { SupervisorFeedbackModel } from './SupervisorFeedback.model';

export interface ProjectApplicationModel {
  id: number;
  title: string;
  description: string;
  submittedAt?: string;
  status: ApplicationStatus;

  // Client Info
  clientName: string;
  clientBank: string;
  clientBankIban: string;

  // Financial
  price: number;
  priceInWords: string;

  // Construction Materials
  usesConcrete: boolean;
  usesBricks: boolean;
  usesSteel: boolean;
  usesInsulation: boolean;
  usesWood: boolean;
  usesGlass: boolean;

  // Relationships
  agentId: string;
  agent: ApplicationUserModel;
  supervisorId?: string;
  supervisor?: ApplicationUserModel;

  files: ApplicationFileModel[];
}
