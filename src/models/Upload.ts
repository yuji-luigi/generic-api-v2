/**
 * *************
 *  SHADAPPS CONFIDENTIAL
 *  ______
 *
 *  Created by Yuji Sato
 *
 *  2022 (c) ShadApps Srl
 *  All Rights Reserved.
 *
 *  NOTICE:  All information contained herein is, and remains
 *  the property of ShadApps Srl and its suppliers,
 *  if any. The intellectual and technical concepts contained
 *  herein are proprietary to ShadApps Srl.
 *  and its suppliers and may be covered by Italian, European and Foreign Patents,
 *  patents in process, and are protected by trade secret or copyright law.
 *  Dissemination of this information or reproduction of this material
 *  is strictly forbidden unless prior written permission is obtained
 *  from ShadApps Srl.
 * *************
 **/
import mongoose from 'mongoose';
import autoPopulate from 'mongoose-autopopulate';
const { Schema } = mongoose;

const uploadSchema = new Schema<IUpload>(
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
    }
  },
  {
    versionKey: false,
    timestamps: true,
    statics: {}
  }
);

uploadSchema.plugin(autoPopulate);

export default mongoose.model('uploads', uploadSchema);
// uploadSchema.virtual('fullPath').get(function () {
//     if(this.folderName){
//         return `${this.folderName}/${this.fileName}`;
//     }
//     return this.fileName;
// });

// https://mongoosejs.com/docs/2.7.x/docs/virtuals.html
uploadSchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('uploads', uploadSchema);
