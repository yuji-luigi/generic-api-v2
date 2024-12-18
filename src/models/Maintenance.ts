import mongoose, { Model } from 'mongoose';
import autoPopulate from 'mongoose-autopopulate';
import { getPrivateUrlOfSpace } from '../api/helpers/uploadFileHelper';
import logger from '../config/logger';
import { formatDateAndTimeForFlights } from '../utils/functions';

const { Schema } = mongoose;

interface IMaintenanceDoc {
  createdAt: string;
  title: string;
  images: IUpload[] | [];
  listViewType: 'default' | 'bigImage';
  articleType: 'default' | 'blog' | 'news' | 'event' | 'announcement' | 'poll' | 'survey' | 'question' | 'discussion';
  description?: string | undefined;
  attachments: IUpload[] | [];
  isImportant: boolean;
  tags?: string[];
  rating?: number | undefined;
  // createdBy: IUser;
  user: IUser;
  organization?: IOrganization | string;
  space: ISpace | string;
  /** decides if everyone in the world can see or only under the organization. */
  isPublic: boolean;
}

interface MaintenanceModel extends Model<IMaintenanceDoc, object, IMaintenanceMethods> {
  // hasSetStorageUrlToModel(): boolean;
  // a: string;
  handleDeleteUploads: (id: string) => Promise<void>;
  setStorageUrlToModel: () => Promise<void>;
  hasSetStorageUrlToModel: true;
}

export const threadSchema = new Schema<IMaintenanceDoc, MaintenanceModel, IMaintenanceMethods>(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: '',
      required: true
    },
    images: [
      {
        type: Schema.Types.ObjectId,
        ref: 'uploads',
        autopopulate: true
      }
    ],
    articleType: {
      type: String,
      default: 'default'
    },
    listViewType: {
      type: String,
      default: 'default'
    },
    attachments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'uploads',
        autopopulate: true
      }
    ],
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: 'tags'
      }
    ],
    isImportant: {
      type: Boolean,
      default: false
    },
    rating: Number,

    user: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      autopopulate: true
    },
    isPublic: {
      type: Boolean,
      default: false
    },
    organization: {
      type: Schema.Types.ObjectId,
      ref: 'organizations',
      required: true
    },
    space: {
      type: Schema.Types.ObjectId,
      ref: 'spaces'
      // required: true,
    }
  },
  {
    versionKey: false,
    timestamps: true,
    methods: {
      /**
       * in the process the image url is set to imageUrl.
       * so never need to call GET storage/key to get the url
       * @returns {Promise<void>}
       */
      setStorageUrlToModel: async function () {
        const { attachments } = this;
        const { images } = this;
        const attachmentUrls: string[] = [];
        const imageUrls: string[] = [];
        for (const singleUpload of attachments) {
          if (singleUpload === null) continue;
          if (singleUpload === undefined) continue;
          const obj = { params: { key: singleUpload.fullPath } };
          const url = await getPrivateUrlOfSpace(obj);
          singleUpload.url = url;
          attachmentUrls.push(url);
        }
        for (const singleUpload of images) {
          if (singleUpload === null) continue;
          if (singleUpload === undefined) continue;
          const obj = { params: { key: singleUpload.fullPath } };
          const url = await getPrivateUrlOfSpace(obj);
          imageUrls.push(url);
          singleUpload.url = url;
        }
        this.attachmentUrls = attachmentUrls;
        this.imageUrls = imageUrls;
      },
      handleDeleteUploads: async function () {
        const { attachments } = this;
        const { images } = this;
        try {
          for (const singleUpload of attachments) {
            if (!singleUpload) continue;
            await singleUpload.deleteFromStorage();
          }
          for (const singleUpload of images) {
            if (!singleUpload) continue;
            await singleUpload.deleteFromStorage();
          }
        } catch (error) {
          logger.error('error in handleDeleteUploads', error.message || error);
          throw error;
        }
      }
    }
  }
);

threadSchema.plugin(autoPopulate);

// threadSchema.get('_createdAt', function (v) {
//   return v.toISOString();
// });

threadSchema.virtual('_createdAt').get(function () {
  return formatDateAndTimeForFlights(this.createdAt);
});
threadSchema.set('toJSON', {
  virtuals: true
});

export default mongoose.model<IMaintenanceDoc, MaintenanceModel>('maintenances', threadSchema);
