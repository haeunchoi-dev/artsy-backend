export interface IS3ImageFile extends Express.Multer.File {
  s3Url?: string;
  width?: number;
  height?: number;
}

export interface IResDBImageFile {
  id: number;
  ticketId: number;
  imageUrl: string;
  originalName: string;
  fileName: string;
  width: number;
  height: number;
  extension: string;
  fileSize: number;
  isPrimary: number;
  createDate: null; // TODO check
}
