import mongoose from 'mongoose';
import autoPopulate from 'mongoose-autopopulate';
import { IProposal } from 'model/Proposal';
const { Schema } = mongoose;

const proposalSchema = new Schema<IProposal>(
  {
    amount:Number,
    description: String,
    fundRule:{
      type: Schema.Types.ObjectId,
      ref: 'fundRules',
    },
    building:{
      type: Schema.Types.ObjectId,
      ref: 'buildings',
    },
    proposals: [{
      type: Schema.Types.ObjectId,
      ref: 'proposals',
    }],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
  },
  {
    versionKey: false,
    timestamps: true
  }
);

proposalSchema.statics = {};

proposalSchema.plugin(autoPopulate);

export default mongoose.model('proposals', proposalSchema);
