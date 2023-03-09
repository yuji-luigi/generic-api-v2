interface IThread /* extends Document */ {
  _id?: string;
  title: string;
  body?: string | undefined;
  attachments?: string[] | undefined;
  tags?: string[];
  building?: string | IBuilding;
  createdBy: IUser | string;
  owner: IOwner | string;
}
