import mongoose, { model, Model } from 'mongoose';
const { Schema } = mongoose;

export type SpaceModel = Model<ISpace, unknown, ISpaceMethods>;

export const spacesSchema = new Schema<ISpace, SpaceModel, ISpaceMethods>(
  {
    name: {
      type: String,
      required: true
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
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'users'
    }
  },
  {
    methods: {
      /** get parent of this document.(current document) */
      async getParent() {
        return (await mongoose
          .model('spaces')
          .findById(this.parentId)) as unknown as ISpace;
      },

      /**
       *
       * Get array of id of all of it "current" ancestors use this
       * when necessary to filter the data by ancestor idsavoid making field ancestors instead created this method to be
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
      }
      // getChildren(currentDocument: ISpace, children: string[]) {

      //   if(currentDocument.isTail)
      //     return children ;
      // }
    },

    versionKey: false,
    timestamps: true
  }
);

// populate the name of the owner field
spacesSchema.pre('find', function () {
  this.populate('owner', 'name');
});

const Space = model<ISpace, SpaceModel>('spaces', spacesSchema);
export default Space;
