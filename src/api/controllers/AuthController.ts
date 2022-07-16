/** *********** User ************* */
import { Request, Response, NextFunction } from 'express';
import moment from 'moment-timezone';
import httpStatus from 'http-status';
import User from '../../models/User';
import { UserModel } from 'model/user';
import vars from '../../config/vars';
import MSG from '../../utils/messages';

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
    const { email, password, password2, name, surname } = req.body;
    if (password !== password2) {
      throw new Error('Password non corrispondenti');
    }

    // IF YOU WANT TO CREATE SOME OTHER ENTITY WITH NEW USER. CODE HERE
    // const {data, message} = await crudHelper.createWithReturnValue('projects', {
    //     name: project,
    //     email_sender: email,
    // });

    const newUser = new User({ email, password, name, surname, role: 'user' });
    const createdUser = await newUser.save();
    // POSTMAN DOESN'T WORK REDIRECT
    res.status(httpStatus.CREATED).send({
      success: true,
      message: MSG().OBJ_CREATED,
      data: createdUser,
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

    res.cookie('jwt', token.accessToken, {
      httpOnly: true,
      sameSite: true,
      maxAge: 99999,
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
  // const domain = cookieDomain;
  // cancello il cookie
  res.clearCookie('jwt');

  res.status(httpStatus.OK).json({ message: 'Logout effettuato con successo' });
};

const me = async (req: Request, res: Response) => {
  // set last login
  const user = await User.findOne({ _id: res.locals.user._id });
  user.last_login = new Date();
  await user.save();
  return res.status(httpStatus.OK).send({
    success: true,
    data: {
      user: res.locals.user
    }
  });
};

export default {
  login,
  logout,
  me,
  register
};
