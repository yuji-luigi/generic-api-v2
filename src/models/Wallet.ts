import mongoose from 'mongoose';
import autoPopulate from 'mongoose-autopopulate';
import { IWallet } from 'model/wallet';

const { Schema } = mongoose;

export const walletSchema = new Schema<IWallet>(
  {
    amount: Number,
    user:{
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true
  }
);

walletSchema.statics = {};

walletSchema.plugin(autoPopulate);

export default mongoose.model('wallets', walletSchema);
