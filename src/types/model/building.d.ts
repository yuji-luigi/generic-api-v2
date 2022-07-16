import { UserModel } from './user';
import { IThread } from './Thread';

export interface IBuilding {
  _id?: string | undefined;
  name?: string;
  address?: string;
  floors?: string[];
  password: string;
  threads?: string[] | IThread[] | undefined;
  fund: string[];
  administrator: string | UserModel;
}
