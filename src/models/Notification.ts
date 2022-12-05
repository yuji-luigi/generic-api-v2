import mongoose from 'mongoose';
import autoPopulate from 'mongoose-autopopulate';
const { Schema } = mongoose;

export const notificationSchema = new Schema<IBookmark>(
  {
    date: String,
    threads: String,
    note: String,
    building: String
  },
  {
    versionKey: false,
    timestamps: true
  }
);

notificationSchema.plugin(autoPopulate);

export default mongoose.model('notifications', notificationSchema);
