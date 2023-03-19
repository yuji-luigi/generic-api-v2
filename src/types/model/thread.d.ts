interface IThread extends MongooseBaseModel<null, null> {
  _id?: string;
  createdAt: string;
  title: string;
  images: IUpload[] | [];
  listViewType: 'default' | 'bigImage';
  articleType:
    | 'default'
    | 'blog'
    | 'news'
    | 'event'
    | 'announcement'
    | 'poll'
    | 'survey'
    | 'question'
    | 'discussion';
  description?: string | undefined;
  attachments: IUpload[] | [];
  isImportant: boolean | undefined;
  tags?: string[];
  building?: string | IBuilding;
  rating?: number | undefined;
  createdBy: IUser | string;
  organization: IOrganization | string;
}

interface IThreadMethods {
  setStorageUrlToModel: () => Promise<void>;
}
