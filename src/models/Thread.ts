import mongoose from 'mongoose';
import autoPopulate from 'mongoose-autopopulate';

const { Schema } = mongoose;

export const threadSchema = new Schema<IThread>(
  {
    title: String,
    description: {
      type: String,
      default: ''
    },
    images: [
      {
        type: Schema.Types.ObjectId,
        ref: 'uploads',
        autopopulate: true
      }
    ],
    imagesUrl: [String],

    attachments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'uploads',
        autopopulate: true
      }
    ],
    attachmentsUrl: [String],
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: 'tags'
      }
    ],
    rating: Number,
    building: {
      type: Schema.Types.ObjectId,
      ref: 'buildings'
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      autopopulate: true
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'owners',
      required: true
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
);

threadSchema.statics = {};

threadSchema.plugin(autoPopulate);

export default mongoose.model('threads', threadSchema);
