import mongoose from 'mongoose';
import autoPopulate from 'mongoose-autopopulate';
import { ITag } from 'model/Tag';

const { Schema } = mongoose;

const tagSchema = new Schema<ITag>(
  {
    name: String,
    description: String,
    color: String,
    building: {
      type: Schema.Types.ObjectId,
      ref: 'buildings',
    },
  },
  {
    versionKey: false,
    timestamps: true
  }
);

tagSchema.statics = {};

tagSchema.plugin(autoPopulate);

export default mongoose.model('tags', tagSchema);
