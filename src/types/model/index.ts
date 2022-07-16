import { IBookmark } from './bookmark';
import { IBuilding } from './Building';
import { IComment } from './Comment';
import { IFloor } from './Floor';
import { IFund } from './Fund';
import { IFundRule } from './FundRule';
import { IInstance } from './Instance';
import { IProposal } from './Proposal';
import { ITag } from './Tag';
import { IThread } from './Thread';
import { IUserSetting } from './UserSetting';
import { IUser } from './user';
import { IWallet } from './wallet';

export interface IAllSchema
  extends     IBookmark,
  IBuilding, IComment, IFloor, IFundRule, IInstance, IProposal, ITag, IThread, IUser, IUserSetting, IWallet, IFund
     {}

export type AllModels = IAllSchema;
