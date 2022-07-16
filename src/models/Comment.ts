import mongoose from 'mongoose';
import autoPopulate from 'mongoose-autopopulate';
import { IComment } from 'model/Comment';
const { Schema } = mongoose;

const commentSchema = new Schema<IComment>(
  {
    title: String,
    body: String,
    password: String,
    fund: {
      type: Schema.Types.ObjectId,
      ref: 'funds',
    } ,
    building: {
      type: Schema.Types.ObjectId,
      ref: 'buildings',
    },
    user:{
      type: Schema.Types.ObjectId,
      ref: 'users',
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
);

commentSchema.statics = {};
//
// commentSchema.pre('validate', async function save(next) {
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

commentSchema.plugin(autoPopulate);

export default mongoose.model('comments', commentSchema);
