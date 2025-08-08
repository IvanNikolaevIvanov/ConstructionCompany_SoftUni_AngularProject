export interface ApplicationFileModel {
  fileName: string;
  file: File;
  base64Content?: string;
}

export interface ApplicationFileDetailsModel {
  fileName: string;
  filePath: string;
}
