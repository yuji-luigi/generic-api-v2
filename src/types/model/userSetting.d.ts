import { UserModel } from './user';

 interface IUserSetting {
  _id?: string |undefined;
  pushNotification: boolean;
  smsNotification: boolean;
  user: string| UserModel;
}
