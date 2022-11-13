import { IUser } from './../../types/model/user.d';
import { RegisterData } from './../../types/auth/formdata.d';
/** *********** User ************* */
import { Request, Response, NextFunction } from 'express';
import moment from 'moment-timezone';
import httpStatus from 'http-status';
import User from '../../models/User';
import { UserModel } from 'model/user';
import vars from '../../config/vars';
import MSG from '../../utils/messages';
import logger from '../../config/logger';

const { jwtExpirationInterval, cookieDomain } = vars;

/**
 * Returns a formated object with tokens
 * @private
 */
function generateTokenResponse(user: UserModel, accessToken: string) {
  const tokenType = 'Bearer';
  const expiresIn = moment().add(jwtExpirationInterval, 'seconds');
  return {
    tokenType,
    accessToken,
    expiresIn
  };
}

const register = async (req: Request, res: Response) => {
  try {
    const { email, password, password2, name, surname } = req.body as RegisterData;

    if (password !== password2) {
      throw new Error('Password non corrispondenti');
    }

    // IF YOU WANT TO CREATE SOME OTHER ENTITY WITH NEW USER. CODE HERE
    // const {data, message} = await crudHelper.createWithReturnValue('projects', {
    //     name: project,
    //     email_sender: email,
    // });

    // Created user must have the User field and methods such as token()
    const newUser = new User({ email, password, name, surname, role: 'user' }) as IUser;

    const accessToken = newUser.token();
    const token = generateTokenResponse(newUser as UserModel, accessToken);
    res.cookie('jwt', token.accessToken, {
      httpOnly: true,
      sameSite: true,
      maxAge: 99999999,
      domain: cookieDomain,
    });
    const createdUser = await newUser.save();
    // POSTMAN DOESN'T WORK REDIRECT
    res.status(httpStatus.CREATED).send({
      success: true,
      message: MSG().OBJ_CREATED,
      user: createdUser,
      accessToken,
      count: 1
    });
    // return res.status(httpStatus.OK).redirect('/');
  } catch (error) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: error.message || error })
      .redirect('/');
  }
};

/**
 * Returns jwt token if valid username and password is provided
 * @public
 */
const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user, accessToken } = await User.findAndGenerateToken(req.body);
    const token = generateTokenResponse(user, accessToken);
    // const userTransformed = user.transform();
    // Send Set-Cookie header
    const domain = cookieDomain;
    console.log(domain);

    res.cookie('jwt', token.accessToken, {
      httpOnly: true,
      sameSite: true,
      maxAge: 99999999,
      domain
    });

    res.send({
      success: true,
      data: { token /* , user: userTransformed */ }
    });
  } catch (error) {
    next(error);
  }
};

const logout = (req: Request, res: Response) => {
  console.log('logout!!');
  // const domain = cookieDomain;
  // cancello il cookie
  res.clearCookie('jwt');
  res.status(httpStatus.OK).json({ message: 'Logout effettuato con successo' });
};

const me = async (req: Request, res: Response) => {
  // set last login
  try{

    const user = await User.findOne({ _id: res.locals.user._id });
    user.last_login = new Date(Date.now());
    await user.save();
    return res.send({
      success: true,
      user: res.locals.user

    });
  } catch(error) {
    logger.error(error.message || error);
    res.send('error');
  }
};

export default {
  login,
  logout,
  me,
  register
};
