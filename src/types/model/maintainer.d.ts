interface MaintainerInterface extends MongooseBaseModel<null, null> {
  name: string;
  avatar: IUpload | string;
  homepage: string;
  type: string;
  tel: string;
  email: string;
  logo: string;
  description: string;
  address: string;
  isIndividual: boolean;
  // organizations: IOrganization[];
  // spaces: ISpaces[];
  createdBy: string | IUser;
}
