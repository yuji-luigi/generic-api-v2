import { IThread } from './Thread';import { IBuilding } from './Building';

export interface IBookmark /* extends Document */ {
  _id?: string | undefined;
  date?: string | undefined;
  threads?: string[] | IThread[] | undefined;
  note?: string | undefined;
  building?: string | IBuilding;

}
