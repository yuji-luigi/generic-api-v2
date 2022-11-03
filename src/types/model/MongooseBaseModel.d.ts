interface MongooseBaseModel<ParentEntity, ChildEntity> {
  _id: string
  name?: string
  title?: string
  children?: Array<ChildEntity> | null | undefined
  parent?: ParentEntity | null | undefined;
}