interface IBuilding {
  _id?: string | undefined;
  name?: string;
  address?: string;
  floors?: string[];
  password: string;
  threads?: string[] | IThread[] | undefined;
  fund: string[] | IFund;
  administrator?: string | IUser | null;
}
