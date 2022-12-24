interface ISpace extends MongooseBaseModel<ISpace, ISpace> {
  /** to show @top level in frontend */
  isHead: boolean;
  /** meaning that this is the end of the chain of spaces.
   *
   * Also meaning that has no children */
  isTail: boolean;
  /** reference Id to query.
   *
   * click parent do query by parentId and get the children
   */
  parentId?: ISpace | string | null;
  address?: string;
  // floors?: string[];
  password: string;
  // threads?: string[] | IThread[] | undefined;

  /** reference id to query. users can't see other owners data.(space fund users... etc) */
  owner: string | IOwner | null;
}

interface ISpaceMethods {
  getParent(): ISpace | null | undefined;
  getParent(): ISpace | null | undefined;
  // getChildren(): ISpace[] | [] | null | undefined
  getAncestors(currentDocument: ISpace,children: string[]): string[]| null | undefined
}