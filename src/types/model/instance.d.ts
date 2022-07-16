import { IBuilding } from './Building';
import { IProposal } from './Proposal';
import { IUser } from './user';

export interface IInstance /* extends Document */ {
  _id?: string;
  name?: string | undefined;
  description?: string | undefined;
  users?: string[] | IUser[];
  building?: string | IBuilding;
  type: 'space' | 'user';
  proposals?: string[] | IProposal[] | undefined;
}
