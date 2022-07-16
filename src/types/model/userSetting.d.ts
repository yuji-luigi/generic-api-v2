import { UserModel } from './user';

export interface IUserSetting {
  _id?: string |undefined;
  pushNotification: boolean;
  smsNotificaion: boolean;
  administrator: string| UserModel;
}
