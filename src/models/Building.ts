import mongoose from 'mongoose';
// import autoPopulate from 'mongoose-autopopulate';
const { Schema } = mongoose;

export const buildingSchema = new Schema<IBuilding>(
  {
    name: String,
    address: String,
    areas: [
      {
        type: Schema.Types.ObjectId,
        ref: 'areas'
      }
    ],
    password: String,
    // threads: String,
    funds: {
      type: Schema.Types.ObjectId,
      ref: 'funds'
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'users'
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
);

buildingSchema.statics = {};

// buildingSchema.plugin(autoPopulate);

export default mongoose.model('buildings', buildingSchema);
