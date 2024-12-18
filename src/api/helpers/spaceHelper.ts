import { ObjectId } from 'mongodb';
import Space from '../../models/Space';
import logger from '../../config/logger';
import { _MSG } from '../../utils/messages';

/**  searches only root spaces of user */
export async function userHasSpace(user: IUser, selectedSpace: string): Promise<boolean> {
  // return user.rootSpaces.includes(selectedSpace._id.toString());
  const rootSpaces = user.rootSpaces.map((rootSpace) => rootSpace.toString());

  return rootSpaces.some((rootSpace) => rootSpace.toString() === selectedSpace.toString());
}
/**  depth-first search (DFS) */
export async function userHasSpaceDFS(user: IUser, selectedSpace: ISpace): Promise<boolean> {
  // return user.rootSpaces.includes(selectedSpace._id.toString());
  const rootSpaces = user.rootSpaces.map((rootSpace) => rootSpace.toString());

  const hasSpaceAsRootSpace = rootSpaces.some((rootSpace) => rootSpace.toString() === selectedSpace._id.toString());
  if (hasSpaceAsRootSpace) {
    return hasSpaceAsRootSpace;
  }

  // need to search in all
  for (const rootSpace of rootSpaces) {
    // const descendants = await aggregateDescendantIds(rootSpace, user);
    const hasSpaceAsDescendant = await searchDescendants(rootSpace, selectedSpace._id.toString(), user);
    if (hasSpaceAsDescendant) {
      return true;
    }
  }

  return;
}

async function searchDescendants(spaceId: string, targetId: string, user: IUser): Promise<boolean> {
  const descendants = await aggregateDescendantIds(spaceId, user);
  const hasSpaceAsDescendant = descendants.some((descendant) => descendant.toString() === targetId);
  if (hasSpaceAsDescendant) {
    return true;
  }
  for (const descendant of descendants) {
    const hasSpaceAsDescendantOfDescendant = await searchDescendants(descendant.toString(), targetId, user);
    if (hasSpaceAsDescendantOfDescendant) {
      return true;
    }
  }
}

/** breadth-first search */
export async function userHasSpaceBFS(user: IUser, selectedSpace: ISpace): Promise<boolean> {
  const rootSpaces = user.rootSpaces.map((rootSpace) => rootSpace.toString());

  // Initialize a queue with the root spaces
  const queue = [...rootSpaces];

  while (queue.length > 0) {
    const currentSpaceId = queue.shift();

    // Check if the current space is the selected space
    if (currentSpaceId === selectedSpace._id.toString()) {
      return true;
    }

    // Get the descendants of the current space and add them to the queue
    const descendants = await aggregateDescendantIds(currentSpaceId, user);
    queue.push(...descendants.map((descendant) => descendant.toString()));
  }

  return false;
}

export async function aggregateDescendantIds(spaceId: string, user: IUser): Promise<string[]> {
  try {
    const space = await Space.findById(spaceId);
    if (!(await user.isAdminOrganization(space._id)) || !(await userHasSpaceBFS(user, space))) {
      throw new Error(_MSG.NOT_ALLOWED);
    }
    const selectedId = new ObjectId(spaceId);

    const pipeline = [
      // Find all documents with parentId equal to the selected space ID
      { $match: { parentId: selectedId } },
      // Create a new field to store the selected space ID as an array
      { $set: { descendantIds: [selectedId] } },
      // Recursively search for all descendants
      {
        $graphLookup: {
          from: 'spaces',
          startWith: '$descendantIds',
          connectFromField: '_id',
          connectToField: 'parentId',
          as: 'descendants'
        }
      },
      // Unwind the descendants array
      { $unwind: '$descendants' },
      // Group the documents by parentId and create an array of unique descendantIds for each group
      {
        $group: {
          _id: '$descendants.parentId',
          // descendantIds: { $addToSet: '$descendants' }
          descendantIds: { $addToSet: '$descendants._id' }
          // descendantIds: { $addToSet: { $concatArrays: [[selectedId], '$descendants._id'] } }
        }
      },
      // Unwind the descendantIds array
      { $unwind: '$descendantIds' },
      // Group all the descendantIds into a single array
      { $group: { _id: null, descendantIds: { $addToSet: '$descendantIds' } } },
      // Project to remove the _id field and return only the descendantIds array
      { $project: { _id: 0, descendantIds: 1 } }
    ];

    const result = await Space.aggregate(pipeline).exec();

    const spaceIds = result[0].descendantIds;
    spaceIds.push(selectedId);
    // const spaceIds = result.map((space) => space._id);
    // const spaceIds = result.flatMap((space) => space.descendantIds.toString().split(','));

    return spaceIds;
  } catch (err) {
    logger.error(err);
    throw new Error(err);
  }
}
