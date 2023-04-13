import mongoose, { model, Model } from 'mongoose';
import { getOrganizationOfHead } from '../api/helpers/customHelper';
import logger from '../config/logger';
const { Schema } = mongoose;
import jwt from 'jsonwebtoken';

import vars from '../config/vars';

const { jwtSecret } = vars;

export type SpaceModel = Model<ISpace, unknown, ISpaceMethods>;

export const spacesSchema = new Schema<ISpace, SpaceModel, ISpaceMethods>(
  {
    name: {
      type: String,
      required: true
    },
    maxUsers: {
      type: Number,
      default: 0
    },
    address: String,
    isHead: {
      type: Boolean,
      default: false
    },
    isTail: {
      type: Boolean,
      default: true
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: 'spaces'
    },
    password: String,
    spaceType: {
      type: String
      // enum: ['city', 'district', 'neighborhood', 'street', 'building', 'floor', 'space'],
    },
    isPublic: {
      type: Boolean,
      default: false
    },
    admins: [
      {
        type: Schema.Types.ObjectId,
        ref: 'users'
      }
    ],
    organization: {
      type: Schema.Types.ObjectId,
      ref: 'organizations'
      // required: true
      // autopopulate: true
    }
  },
  {
    methods: {
      /** get parent of this document.(current document) */
      async getParent() {
        return (await mongoose.model('spaces').findById(this.parentId)) as unknown as ISpace;
      },

      /**
       *
       * Get array of id of all of it "current" ancestors use this
       * when necessary to filter the data by ancestor ids avoid making field ancestors instead created this method to be
       * flexible in case of ancestor is modified.
       **/
      async getAncestors(currentDocument = this, ancestors: string[] = []) {
        /** clone the ancestor array to be pure function */
        const clonedAncestor = [...ancestors];
        /** get the parent of the current schema */
        const ancestor = await currentDocument.getParent();
        clonedAncestor.push(ancestor._id.toString());
        /** if parent is present then call the function recursively */
        if (ancestor.parentId) {
          return this.getAncestors(ancestor);
        }
        /** At the end return the array */
        return clonedAncestor;
      },
      async getHeadSpace() {
        try {
          const parent = await this.getParent();
          if (parent.isHead) {
            return parent;
          }
          return parent.getHeadSpace();
        } catch (error) {
          logger.error(error.message || error);
        }
      },
      token() {
        const payload = {
          id: this._id
          // name: this.name,
          // surname: this.surname,
          // email: this.email
          // role: this.role,
          // description: this.description,
          // avatar: this.avatar,
          // locale: this.locale,
        };
        return jwt.sign(payload, jwtSecret, {
          expiresIn: '24h' // expires in 24 hours
        });
      }
    },

    versionKey: false,
    timestamps: true
  }
);

// populate the name of the organization field
spacesSchema.pre('find', function (next) {
  this.populate('organization', 'name');
  next();
});

spacesSchema.pre('validate', async function (next) {
  if (this.organization) {
    return next();
  }
  const organization = await getOrganizationOfHead(this.parentId, 'spaces');
  this.organization = organization;
  next();
});

const Space = model<ISpace, SpaceModel>('spaces', spacesSchema);
export default Space;
