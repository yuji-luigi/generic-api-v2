import mongoose from 'mongoose';
import autoPopulate from 'mongoose-autopopulate';

const { Schema } = mongoose;

export const instanceSchema = new Schema<IInstance>(
  {
    name: String,
    description: String,
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: 'users'
      }
    ],
    building: {
      type: Schema.Types.ObjectId,
      ref: 'buildings'
    },
    type: {
      type: String,
      enum: ['user', 'space']
    },
    proposals: [
      {
        type: Schema.Types.ObjectId,
        ref: 'proposals'
      }
    ]
  },
  {
    versionKey: false,
    timestamps: true
  }
);

instanceSchema.statics = {};

instanceSchema.plugin(autoPopulate);

export default mongoose.model('instances', instanceSchema);
