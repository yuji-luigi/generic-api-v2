import mongoose from 'mongoose';
import autoPopulate from 'mongoose-autopopulate';
import { IInstance } from 'model/Instance';

const { Schema } = mongoose;

const instanceSchema = new Schema<IInstance>(
  {
    name: String,
    description: String,
    users: [{
      type: Schema.Types.ObjectId,
      ref: 'users',
    }],
    building: {
      type: Schema.Types.ObjectId,
      ref: 'buildings',
    },
    type: {
      type: String,
      enum: ['user','space' ]
    },
    proposals: [{
      type: Schema.Types.ObjectId,
      ref: 'proposals',
    }],
  },
  {
    versionKey: false,
    timestamps: true
  }
);

instanceSchema.statics = {};
//
// instanceSchema.pre('validate', async function save(next) {
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

instanceSchema.plugin(autoPopulate);

export default mongoose.model('instances', instanceSchema);
