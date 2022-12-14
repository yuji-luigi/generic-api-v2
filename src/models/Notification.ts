import mongoose from 'mongoose';
import autoPopulate from 'mongoose-autopopulate';
const { Schema } = mongoose;

export const notificationSchema = new Schema<INotification>(
  {
    title: String,
    body: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true
  }
);

notificationSchema.plugin(autoPopulate);

export default mongoose.model('notifications', notificationSchema);
