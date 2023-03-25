// import { Model } from 'mongoose';
// import { IUserSetting } from './UserSetting';

type UserError = {
  status?: number;
  isPublic?: boolean;
  message?: string;
};

/** UserModel static methods*/
//  interface UserModel<MongooseModel> extends MongooseModel<IUser> {
//   roles: string[];
//   passwordMatches(password: string): boolean;
//   findAndGenerateToken(body: IUser): {
//     user: UserModel;
//     accessToken: string;
//   };
//   token(): () => string;
//   save(): () => void;
// }

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

type userRoles = 'user' | 'admin' | 'super_admin';

interface IUser /* extends UserModel */ {
  _id?: string;
  avatar?: IUpload;
  name?: string | undefined;
  surname?: string | undefined;
  phone?: string | undefined;
  email?: string | undefined;
  password: string;
  /** will be only super_admin and user. will use adminOf field to check if user is admin of an space.
   */
  role?: userRoles;
  adminOf?: ISpace[] | [];

  bookmarks?: string[];
  wallet?: string;
  buildings?: string[] | undefined;
  userSetting: string | boolean;
  last_login?: Date;
  modules?: modules;
  organization?: IOrganization | null | undefined;

  _update?: {
    password?: Buffer | string;
  };
  token(): () => string;
  /*   roles: string[] | any;
   */
}
