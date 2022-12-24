/*
  Create RootContainer

  Create ChildContainer

  Create Instance
    - name
    - address
    - isRoot
    - password
    - owner
    // childrenRef not needed
    use parentId in children model to figure out whose children they are
    - childrenRef: [city, building, floor, room...etc] Must be _id (nextNode)

  Creation of instance of child of a instance: Creation of child Instance
    click Parent Instance -> has a childrenRef -> name onclick enabled ->
    click name of instance -> go to childInstance page -> can create instance with childRef assigned.
  Create ChildrenRef
    - name
    - description??
*/

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
