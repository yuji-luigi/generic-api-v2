import { ITag } from './Tag';
import { IBuilding } from './Building';

export interface IThread /* extends Document */ {
  _id?: string;
  title: string;
  body?: string | undefined;
  attachments?: string[] | undefined;
  tags?: string[] | ITag[];
    building?: string | IBuilding;

}
