type ActionEnum = 'LOGIN' | 'REGISTER' | 'LOGOUT' | 'INITIALIZE';

// export type JWTContextState = {
//   isAuthenticated?: boolean;
//   isInitialized?: boolean;
//   user?: IUser | null;
// };
// export interface ReducerStateAction {
//   payload?: JWTContextState;
// }

// export interface JWTContextReducerAction {
//   payload?: JWTContextState;
//   type: ActionEnum;
// }

// export interface JWTContextReducerLogoutAction {
//   type: 'LOGOUT';
// }

// export type JWTContextReducer = (
//   state: JWTContextState,
//   action: ReducerStateAction
// ) => JWTContextState;

 type Logout = () => Promise<void>;

 interface LoginData {
  email: string;
  password: string;
}

 interface RegisterData extends LoginData {
  password2: string;
  name: string;
  surname: string | null;
  // role: string | null;
}
 type Register = (data: RegisterData) => Promise<void>;
 type Login = (email?: string, password?: string) => Promise<void>;

// export interface AuthContextInterface {
//   // initialState?: JWTContextState;
//   method: string;
//   login: Login;
//   logout: () => void;
//   register: Register;
// }
