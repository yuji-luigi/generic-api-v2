import { IUser } from './user';

export type TimestampsType =
  | {
      cratedAt: Date | undefined;
      updatedAt: Date | undefined;
    }
  | undefined;

export interface ItemSchemaInterface /* extends Document */ {
  _id?: string;
  title?: string | undefined;
  description?: string | undefined;
  quantity?: number | undefined;
  price?: number | undefined;
  createdAt?: Date | undefined;
  updatedAt?: Date | undefined;
}

export interface AllModelsInterface
  extends     IUser,
    ItemSchemaInterface {}
