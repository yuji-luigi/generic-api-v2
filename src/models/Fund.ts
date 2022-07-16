import mongoose from 'mongoose';
import autoPopulate from 'mongoose-autopopulate';
import { IFund } from 'model/Fund';
const { Schema } = mongoose;

const fundSchema = new Schema<IFund>(
  {
    amount: Number,
    fundRules: [{
      type: Schema.Types.ObjectId,
      ref: 'fundRules',
    }],
    building:{
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

fundSchema.statics = {};
//
// fundSchema.pre('validate', async function save(next) {
//     // convert string to date so no error
//     Object.entries(this.documents).forEach(([key, document]) => {
//         console.log({ document })
//         if (typeof document === 'function') return
//         if (document?.expiringDate) {
//             document.expiringDate = 0
//         }
//         next()
//     })
// });

fundSchema.plugin(autoPopulate);

export default  mongoose.model('funds', fundSchema);
