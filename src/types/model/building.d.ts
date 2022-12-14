interface IBuilding {
  _id?: string | undefined;
  name?: string;
  address?: string;
  // floors?: string[];
  areas: IArea[];
  password: string;
  // threads?: string[] | IThread[] | undefined;
  fund: string[] | IFund;
  owner: string | IOwner | null;

}
