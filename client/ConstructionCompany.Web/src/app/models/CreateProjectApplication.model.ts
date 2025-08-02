import { ApplicationFileModel } from './ApplicationFile.model';

export interface CreateProjectApplication {
  title: string;
  description: string;
  clientName: string;
  clientBank: string;
  clientBankIban: string;
  price: number;
  priceInWords: string;

  usesConcrete: boolean;
  usesBricks: boolean;
  usesSteel: boolean;
  usesInsulation: boolean;
  usesWood: boolean;
  usesGlass: boolean;

  files: ApplicationFileModel[];
}
