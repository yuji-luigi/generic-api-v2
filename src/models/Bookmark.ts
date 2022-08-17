import mongoose from 'mongoose';
import autoPopulate from 'mongoose-autopopulate';
import { IBookmark } from 'model/bookmark';
const { Schema } = mongoose;

const bookmarkSchema = new Schema<IBookmark>(
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

bookmarkSchema.plugin(autoPopulate);

const Bookmark =mongoose.model('bookmarks', bookmarkSchema);
export default bookmarkSchema;
