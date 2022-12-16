interface ITag {
  _id?: string;
  name?: string;
  description?: string;
  color?: string;
  building?: string | IBuilding;
  owner?: string | IOwner;
}
