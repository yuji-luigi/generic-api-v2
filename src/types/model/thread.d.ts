interface IThread /* extends Document */ {
  _id?: string;
  title: string;
  images: string[] | IUpload[] | [];
  imagesUrl: string[] | [];
  description?: string | undefined;
  attachments?: string[] | undefined;
  attachmentsUrl?: string[] | undefined;
  tags?: string[];
  building?: string | IBuilding;
  rating?: number | undefined;
  createdBy: IUser | string;
  owner: IOwner | string;
}
