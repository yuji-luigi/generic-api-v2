import mongoose from 'mongoose';
import autoPopulate from 'mongoose-autopopulate';
import { IThread } from 'model/Thread';

const { Schema } = mongoose;

const threadSchema = new Schema<IThread>(
  {
    title: String,
    body: String,
    attachments: [String],
    tags: [{
      type: Schema.Types.ObjectId,
      ref: 'tags',
    }],
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

threadSchema.statics = {};

threadSchema.plugin(autoPopulate);

export default mongoose.model('threads', threadSchema);
