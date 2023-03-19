interface IArea extends MongooseBaseModel<IBuilding, IInstance> {
  building?: string | IBuilding;
  organization: string | IOrganization;
}
