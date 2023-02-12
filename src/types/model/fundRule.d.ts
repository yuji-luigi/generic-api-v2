interface IFundRule /* extends Document */ {
  _id?: string;
  executeCondition?: 'every' | 'majority';
  building?: string | IBuilding | undefined;
  space?: string | ISpace | undefined;
  createdBy?: string | IUser | undefined;
}
