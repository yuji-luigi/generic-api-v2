interface IUpload extends MongooseBaseModel<null, null> {
  // _id?: string | undefined;
  fileName: string;
  originalFileName: string;
  extension: string;
  folder?: string | undefined;
  fullPath: string;
  minetype?: string | undefined;
  size: number;
  url?: string | undefined;
}
