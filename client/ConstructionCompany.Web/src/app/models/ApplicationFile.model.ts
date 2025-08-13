export interface ApplicationFileModel {
  fileName: string;
  file: File;
  base64Content?: string;
  url?: string;
}

export interface ApplicationFileDetailsModel {
  fileName: string;
  filePath: string;
}
