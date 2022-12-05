interface IFund /* extends Document */ {
  _id?: string;
  amount?: number;
  fundRules?: string[] | IFundRule[] | undefined;
  building?: string | IBuilding;

  createdBy?: string | IUser | undefined;
}
