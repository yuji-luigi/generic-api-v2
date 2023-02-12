import mongoose from 'mongoose';

// todo: aggregation method

interface PaginatedResult {
  paginatedResult: Array<any>
}[];
interface Counts {
  counts: {
    total: number
  }[]
}[];

type ResultAggregateWithPagination = (PaginatedResult & Counts)

/**
 *
 * @returns {[Document[],Counts]}
 */
export async function aggregateWithPagination(query: any, entity: string): Promise<ResultAggregateWithPagination[]> {
  /** define skip value, then delete as follows */
  const limit = 10;
  let skip = +query.skip -1 <= 0 ? 0 : (+query.skip - 1) * limit;
  skip = isNaN(skip) ? 0 : skip;
  delete query.skip;// not good way for functional programming. set new query object for querying the DB
  delete query.limit;

  // const clo nedQuery = structuredClone(query);
  const clonedQuery = JSON.parse(JSON.stringify(query));

  if(clonedQuery.parentId){
    clonedQuery.parentId = new mongoose.Types.ObjectId(query.parentId);
  }
  const data = await mongoose.model(entity).aggregate<ResultAggregateWithPagination>([{
    $facet: {
      paginatedResult: [
        {$match: clonedQuery },
        {$skip: skip},
        {$limit: limit}
      ],

      counts:[
        {$match: clonedQuery},
        {$count: 'total'}
      ]
    }

  }]);
  return data;
}
