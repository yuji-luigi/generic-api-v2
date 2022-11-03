import mongoose from 'mongoose';
import autoPopulate from 'mongoose-autopopulate';
import { IBookmark } from 'model/bookmark';
const { Schema } = mongoose;

const bookmarkSchema = new Schema<IBookmark>(
  {
    title: String,
    entity: String,
    /** saving thread or */
    threads: String,
    note: String,
    building: String,
    date: String,
  },
  {
    versionKey: false,
    timestamps: true
  }
);

bookmarkSchema.plugin(autoPopulate);

export const Bookmark = mongoose.model('bookmarks', bookmarkSchema);
export default bookmarkSchema;
