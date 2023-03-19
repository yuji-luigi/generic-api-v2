import mongoose from 'mongoose';
import autoPopulate from 'mongoose-autopopulate';

const { Schema } = mongoose;

export const organizationSchema = new Schema<IOrganization>(
  {
    name: String,
    description: String,
    phone: String,
    email: String,
    homepage: String,
    logoBanner: String,
    logoSquare: String
  },
  {
    versionKey: false,
    timestamps: true
  }
);

organizationSchema.statics = {};

organizationSchema.plugin(autoPopulate);

export default mongoose.model('organizations', organizationSchema);
