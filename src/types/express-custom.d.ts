interface TypedRequestBody<T, U> extends Request {
  params: { [key: string]: string };
  logIn: (userId: string | IUser) => Promise<void>;
  body: T;
  user: U;
  query?: { [key: string]: string | number | boolean | object| undefined };
}

type QueryReturnType = string | number | boolean | undefined;


interface RequestCustom extends Request {
  logIn: (userId: string | IUser) => Promise<void>;
  user?: IUser;
  params: { 
    [key: string]: string
    idMongoose?: string;
    id?: string;
    userId?: string
   };
  query?: { 
    spaces?: QueryReturnType;
    users?: QueryReturnType;
    proposals?: QueryReturnType;
    funds?: QueryReturnType;
    fundRules?: QueryReturnType;
    instances?: QueryReturnType;
    threads?: QueryReturnType;
    comments?: QueryReturnType;
    tags?: QueryReturnType;
    bookmarks?: QueryReturnType;
    wallets?: QueryReturnType;
    userSettings?: QueryReturnType;
    space?: QueryReturnType;
    user?: QueryReturnType;
    proposal?: QueryReturnType;
    fund?: QueryReturnType;
    fundRule?: QueryReturnType;
    instance?: QueryReturnType;
    thread?: QueryReturnType;
    comment?: QueryReturnType;
    tag?: QueryReturnType;
    bookmark?: QueryReturnType;
    wallet?: QueryReturnType;
    userSetting?: QueryReturnType;
    [key?: string]: QueryReturnType | undefined;
   };
}
