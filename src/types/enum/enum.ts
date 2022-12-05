export type TPublishStatus = 'draft' | 'published' | 'deleted';

export interface IPublishStatus {
  [key: string]: string;
}
export enum aa {
  draft,
  published,
  deleted
}
