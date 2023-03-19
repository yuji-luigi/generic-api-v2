interface IOwner extends MongooseBaseModel<null, null> {
  phone: string;
  email: string;
  homepage: string;
  logoBanner?: string;
  logoSquare?: string;
}
