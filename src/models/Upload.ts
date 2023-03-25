import mongoose, { Model } from 'mongoose';
import autoPopulate from 'mongoose-autopopulate';
import { deleteFileFromStorage } from '../api/helpers/uploadFileHelper';
import logger from '../config/logger';
// import { deleteFileFromStorage } from '../api/helpers/uploadFileHelper';
const { Schema } = mongoose;
type IUploadModel = Model<IUpload, object, IUploadMethods>;

const uploadSchema = new Schema<IUpload, IUploadModel, IUploadMethods>(
  {
    /** name of the file with extension */
    fileName: {
      type: String,
      required: true
    },
    /** name of the file without gui date as suffix */
    originalFileName: {
      type: String
    },
    extension: {
      type: String,
      required: true
    },
    minetype: {
      type: String
      // required: true
    },
    /** now is set to be entity. */
    folder: {
      type: String,
      required: true
    },
    /** folder/fileName */
    fullPath: {
      type: String,
      required: true
    },
    size: {
      type: Number
      // required: true,
    },
    url: String
  },
  {
    versionKey: false,
    timestamps: true,
    statics: {},
    methods: {
      methods() {
        console.log('methods');
      },
      async removeThis() {
        console.log('remove');
        const thisData = await mongoose
          .model('uploads')
          .findByIdAndDelete(this._id);
        return thisData;
      },

      async deleteFromStorage() {
        const resultS3 = await deleteFileFromStorage(this.fullPath);
        logger.info(
          `deleteFromStorage resultS3 ${JSON.stringify(resultS3, null, 2)}`
        );
        const result = await this.removeThis();
        logger.info(`delete upload model ${JSON.stringify(result, null, 2)}`);
      }
    }
  }
);

uploadSchema.plugin(autoPopulate);

export default mongoose.model('uploads', uploadSchema);
uploadSchema.virtual('name').get(function () {
  return this.fileName;
});

// https://mongoosejs.com/docs/2.7.x/docs/virtuals.html
uploadSchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('uploads', uploadSchema);
