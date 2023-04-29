export function userHasSpace(user: IUser, space: ISpace): boolean {
  // return user.rootSpaces.includes(space._id.toString());
  const rootSpaces = user.rootSpaces.map((rootSpace) => rootSpace.toString());
  return rootSpaces.some((rootSpace) => rootSpace.toString() === space._id.toString());
}
