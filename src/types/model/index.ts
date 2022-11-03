import { IBookmark } from './bookmark';
import { IBuilding } from './Building';
import { IFund } from './Fund';
import { IFundRule } from './FundRule';
import { IProposal } from './Proposal';
import { ITag } from './Tag';
import { IThread } from './Thread';
import { IUser, modules, UserModel } from './user';
import { IUserSetting } from './UserSetting';
import { IWallet } from './wallet';

export type Entities = 'bookmarks' | 'buildings' | 'comments' | 'floors' | 'funds' | 'instances' | 'proposals' | 'tags' | 'threads' | 'users' | 'userSettings' | 'wallets'

// export type EntitiesArray = ['bookmarks', 'buildings', 'comments', 'floors', 'funds', 'instances', 'proposals', 'tags', 'threads', 'users', 'userSettings', 'wallets']

export type ArrayInObject = {
  [key: string]: any
}

// export interface IAllSchema
//   extends     IBookmark,
//   IBuilding, IComment, IFloor, IFundRule, IInstance, IProposal, ITag, IThread, IUser, IUserSetting, IWallet, IFund
//      {
//       [key: string]: any
//      }

export interface IAllSchema {
  _id?: string | undefined;
  name?: string;
  address?: string;
  floors?: string[];
  password: string;
  threads?: string[] | IThread[] | undefined;
  fund: string[] | IFund;
  administrator: string | UserModel;
  date?: string | undefined;
  entity?: string | undefined;
  note?: string | undefined;
  description?: string | undefined;
  users?: string[] | IUser[];
  type: 'space' | 'user';
  proposals?: string[] | IProposal[] | undefined;  executeCondition?: 'every' | 'majority';
  createdBy?: string | IUser | undefined;
  instances?: string | undefined;
  limitInstances?: string[] | undefined;
  buildings?: string[] | IBuilding[] | undefined;
  amount?: number;
  fundRules?: string[] | IFundRule[] | undefined;
  user?:string |  IUser | undefined;
  smsNotification: boolean;surname?: string | undefined;
  phone?: string | undefined;
  email?: string | undefined;
  role?: string | undefined;
  bookmarks?: string[] | IBookmark[];
  wallet?: string | IWallet;
  userSetting: string | IUserSetting
  last_login?: Date;
  modules?: modules;
  customer?: string;
 body?: string | undefined;
  attachments?: string[] | undefined;
  tags?: string[] | ITag[];
    building?: string | IBuilding;
    color?: string;

  fundRule?: string | IFundRule |undefined;

}
export type AllModels = IAllSchema;
