interface IArea extends MongooseBaseModel<IBuilding, IInstance> {
  building?: string | IBuilding;
  owner: string | IOwner
}
