interface IThread /* extends Document */ {
  _id?: string;
  title: string;
  images: UploadInterface[] | [];
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
  attachments: UploadInterface[] | [];
  tags?: string[];
  building?: string | IBuilding;
  rating?: number | undefined;
  createdBy: IUser | string;
  owner: IOwner | string;
}

interface IThreadMethods {
  setStorageUrlToModel: () => Promise<void>;
}
