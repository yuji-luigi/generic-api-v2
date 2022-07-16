import mongoose from 'mongoose';
import autoPopulate from 'mongoose-autopopulate';
import { IBuilding } from 'model/Building';
const { Schema } = mongoose;

const buildingSchema = new Schema<IBuilding>({
  name: String,
  address: String,
  floors: String,
  password: String,
  threads: String,
  fund: String,
  administrator: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
},
{
  versionKey: false,
  timestamps: true
}
);

buildingSchema.statics = {};

buildingSchema.plugin(autoPopulate);

export default mongoose.model('buildings', buildingSchema);
