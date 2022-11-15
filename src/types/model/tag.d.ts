import { IBuilding } from './Building';

 interface ITag {
  _id?: string;
  name?: string;
  description?: string;
  color?: string;
  building?: string | IBuilding;
}
