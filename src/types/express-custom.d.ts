 interface TypedRequestBody<T, U> extends Request {
  params: {entity: string}
  body: T;
  user: U;
}
