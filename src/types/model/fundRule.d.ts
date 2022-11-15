import { IBuilding } from './Building';
import { IUser } from './user';

 interface IFundRule /* extends Document */ {
  _id?: string;
  executeCondition?: 'every' | 'majority';
  building?: string | IBuilding | undefined;
  createdBy?: string | IUser | undefined;
}
