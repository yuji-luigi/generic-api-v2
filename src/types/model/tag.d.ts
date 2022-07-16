import { IBuilding } from './Building';

export interface ITag {
  _id?: string;
  name?: string;
  description?: string;
  color?: string;
  building?: string | IBuilding;
}
