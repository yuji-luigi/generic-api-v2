import { IBuilding } from './Building';

export interface IFloor /* extends Document */ {
  _id?: string;
  name?: string | undefined;
  instances?: string | undefined;
  limitInstances?: string[] | undefined;
  buildings?: string[] | IBuilding[] | undefined;
}
