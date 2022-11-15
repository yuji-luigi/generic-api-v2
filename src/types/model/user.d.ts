import { Model } from 'mongoose';
import { IBookmark } from './bookmark';
import { IBuilding } from './Building';
import { IUserSetting } from './UserSetting';
import { IWallet } from './wallet';

 type UserError = {
  status?: number;
  isPublic?: boolean;
  message?: string;
};

/*
  UserModel has methods and statics.
*/
 interface UserModel extends Model<IUser> {
  roles: string[];
  passwordMatches(password: string): boolean;
  findAndGenerateToken(body: IUser): {
    user: UserModel;
    accessToken: string;
  };
  token(): string;
  save(): UserModel;
}

/*
    modules is
*/

 type modules =
  | {
      [key: string]: boolean | undefined;
      transports?: boolean | undefined;
      employees?: boolean | undefined;
      apartments?: boolean | undefined;
      worksites?: boolean | undefined;
    }
  | undefined;

/*
    IUser represents what user object has as object without methods and statics.
*/

 interface IUser extends UserModel {
  _id?: string;
  name?: string | undefined;
  surname?: string | undefined;
  phone?: string | undefined;
  email?: string | undefined;
  password: string;
  role?: string | undefined;
  bookmarks?: string[] | IBookmark[];
  wallet?: string | IWallet;
  buildings?: string[] | IBuilding[] | undefined;
  userSetting: string | IUserSetting
  last_login?: Date;
  modules?: modules;
  customer?: string;

  _update?: {
    password?: Buffer | string;
  };
  token(): string;
/*   roles: string[] | any;
 */}
