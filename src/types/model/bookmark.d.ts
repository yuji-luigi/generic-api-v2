import { IThread } from './Thread';
import { IBuilding } from './Building';

 interface IBookmark extends MongooseBaseModel<null, null>{
  // _id?: string | undefined;
  date?: string | undefined;
  entity?: string | undefined;
  threads?: string[] | IThread[] | undefined;
  note?: string | undefined;
  building?: string | IBuilding;

}
