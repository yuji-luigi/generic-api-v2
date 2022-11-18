import mongoose from 'mongoose';
import autoPopulate from 'mongoose-autopopulate';
const { Schema } = mongoose;

const Notification = new Schema<IBookmark>(
  {
    date: String,
    threads: String,
    note: String,
    building: String,
  },
  {
    versionKey: false,
    timestamps: true
  }
);

Notification.plugin(autoPopulate);

export const Bookmark = mongoose.model('bookmarks', Notification);
export default Notification;
