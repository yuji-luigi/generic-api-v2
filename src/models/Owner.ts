import mongoose from 'mongoose';
import autoPopulate from 'mongoose-autopopulate';

const { Schema } = mongoose;

export const ownerSchema = new Schema<IOwner>(
  {
    name: String,
    description: String,
    phone: String,
    email: String,
    homepage: String,
    logoBanner: String,
    logoSquare: String,
  },
  {
    versionKey: false,
    timestamps: true
  }
);

ownerSchema.statics = {};

ownerSchema.plugin(autoPopulate);

export default mongoose.model('owners', ownerSchema);
