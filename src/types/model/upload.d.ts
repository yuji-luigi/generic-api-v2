interface IUpload extends MongooseBaseModel<null, null> {
  // _id?: string | undefined;
  fileName: string;
  originalFileName: string;
  extension: string;
  folder?: string | undefined;
  fullPath: string;
  size: number;
}
