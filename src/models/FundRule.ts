import mongoose from 'mongoose';
import autoPopulate from'mongoose-autopopulate';
import { IFundRule } from 'model/FundRule';

const { Schema } = mongoose;

const fundRuleSchema = new Schema<IFundRule>(
  {
    executeCondition: {
      type: String,
      enum: ['every', 'majority']
    },
    building: {
      type: Schema.Types.ObjectId,
      ref: 'buildings',
    },
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

fundRuleSchema.statics = {};

fundRuleSchema.plugin(autoPopulate);

export default mongoose.model('fundRules', fundRuleSchema);
