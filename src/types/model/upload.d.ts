interface IUpload extends MongooseBaseModel<null, null> {
  // _id?: string | undefined;
  fileName: string;
  originalFileName: string;
  extension: string;
  folder?: string | undefined;
  /** equivalent to key for the storage. includes all dir names and file name.extension */
  fullPath: string;
  minetype?: string | undefined;
  size: number;
  url?: string | undefined;
}
interface IUploadMethods {
  methods: () => void;
  removeThis: () => Promise<object>;
}
