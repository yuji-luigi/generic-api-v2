import mongoose from 'mongoose';
import autoPopulate from 'mongoose-autopopulate';
import { IUserSetting } from 'model/UserSetting';

const { Schema } = mongoose;

const userSettingSchema = new Schema<IUserSetting>(
  {
    pushNotification: Boolean,
    smsNotificaion: Boolean,
    administrator: {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
  },
  {
    versionKey: false,
    timestamps: true
  }
);

userSettingSchema.statics = {};

userSettingSchema.plugin(autoPopulate);

export default mongoose.model('cruds', userSettingSchema);
