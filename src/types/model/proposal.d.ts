import { IBuilding } from './Building';
import { IFundRule } from './FundRule';
import { IUser } from './user';

export interface IProposal /* extends Document */ {
  _id?: string;
  amount?: number | undefined;
  description?: string| undefined;
  fundRule?: string | IFundRule |undefined;
  building?: string | IBuilding;
  proposals?: string[] | IProposal[] | undefined;
  createdBy?: string | IUser | undefined;
}
