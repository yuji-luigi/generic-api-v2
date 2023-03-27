import { s3Client } from './uploadFileHelper';
import mongoose, { SortOrder } from 'mongoose';
import Thread from '../../models/Thread';

// todo: aggregation method

interface PaginatedResult {
  paginatedResult: Array<any>;
}
[];
interface Counts {
  counts: {
    total: number;
  }[];
}
[];

type ResultAggregateWithPagination = PaginatedResult & Counts;

/**
 *
 * @returns {[Document[],Counts]}
 */
export async function aggregateWithPagination(query: any, entity: string): Promise<ResultAggregateWithPagination[]> {
  /** define skip value, then delete as follows */
  const limit = 10;
  let skip = +query.skip - 1 <= 0 ? 0 : (+query.skip - 1) * limit;
  skip = isNaN(skip) ? 0 : skip;
  delete query.skip; // not good way for functional programming. set new query object for querying the DB
  delete query.limit;

  // const clo nedQuery = structuredClone(query);
  // const clonedQuery = JSON.parse(JSON.stringify(query));
  if (query.parentId) {
    query.parentId = new mongoose.Types.ObjectId(query.parentId);
  }
  const data = await mongoose.model(entity).aggregate<ResultAggregateWithPagination>([
    {
      $facet: {
        paginatedResult: [{ $match: query }, { $skip: skip }, { $limit: limit }],

        counts: [{ $match: query }, { $count: 'total' }]
      }
    }
  ]);
  return data;
}

type SortQuery = { [key: string]: SortOrder };
/* |string |  { $meta: 'textScore' } | [string, SortOrder][];
 */

export async function getThreadsForPlatForm({ entity, query, sortQuery = {} }: { entity: Entities; query?: object; sortQuery?: SortQuery }) {
  const threads = await Thread.find<MongooseBaseModel<any, any>>(query).sort({
    isImportant: -1,
    createdAt: -1
  });

  const data = await mongoose
    .model(entity)
    .find(query)
    .sort({ createdAt: -1, ...sortQuery });

  if (threads.length) {
    if (threads[0].setStorageUrlToModel) {
      for (const item of threads) {
        await item.setStorageUrlToModel();
      }
    }
  }
  return threads;
}
