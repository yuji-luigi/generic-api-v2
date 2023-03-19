interface IComment {
  _id?: string;
  title: string;
  body?: string;
  private: boolean;
  anonymous: boolean;
  password: string;
  // fund: string[] | IFund;
  building: string | IBuilding;
  area?: string | IArea;
  instance?: string | IInstance;
  createdBy: string | IUser;
  organization: string | IOrganization | undefined;
}
