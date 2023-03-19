import mongoose from 'mongoose';
import autoPopulate from 'mongoose-autopopulate';

const { Schema } = mongoose;

export const areaSchema = new Schema<IArea>(
  {
    name: String,
    description: String,
    building: {
      type: Schema.Types.ObjectId,
      ref: 'buildings'
    },
    organization: {
      type: Schema.Types.ObjectId,
      ref: 'organizations'
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
);

areaSchema.statics = {};

areaSchema.plugin(autoPopulate);

export default mongoose.model('areas', areaSchema);
