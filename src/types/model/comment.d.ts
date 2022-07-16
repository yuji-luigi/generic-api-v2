import { IUser } from './user';
import { IBuilding } from './Building';
import { IFund } from './Fund';

export interface IComment {
  _id?: string;
  title: string;
  body?: string;
  password: string;
  fund: string[] | IFund;
  building?: string | IBuilding;
  user?:string |  IUser | undefined;
}
