type TimestampsType =
  | {
      cratedAt: Date | undefined;
      updatedAt: Date | undefined;
    }
  | undefined;

interface ItemSchemaInterface /* extends Document */ {
  _id?: string;
  title?: string | undefined;
  description?: string | undefined;
  quantity?: number | undefined;
  price?: number | undefined;
  createdAt?: Date | undefined;
  updatedAt?: Date | undefined;
}

interface AllModelsInterface extends IUser, ItemSchemaInterface {}
