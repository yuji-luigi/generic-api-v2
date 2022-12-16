import mongoose from 'mongoose';
import autoPopulate from 'mongoose-autopopulate';

const { Schema } = mongoose;

export const tagSchema = new Schema<ITag>(
  {
    name: String,
    description: String,
    color: String,
    building: {
      type: Schema.Types.ObjectId,
      ref: 'buildings'
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'owners'
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
);

tagSchema.statics = {};

tagSchema.plugin(autoPopulate);

export default mongoose.model('tags', tagSchema);
