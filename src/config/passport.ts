import passport from 'passport-jwt';
import { Request } from 'express';
import vars from './vars';
import User from '../models/User';

const { jwtSecret } = vars;
const JwtStrategy = passport.Strategy;
// Frontend will send the token in the authorization header.
function extractToken(req: Request) {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(' ')[0] === 'Bearer'
  ) {
    return req.headers.authorization.split(' ')[1];
  }
  if (req.query && req.query.token) {
    return req.query.token;
  }
  return null;
}

/** NEW COOKIE HTTPONLY * */
const cookieExtractor = (req: Request) => {
  let jwt = null;

  // console.log(req.cookies);
  if (req && req.cookies) {
    jwt = req.cookies.jwt;
  }

  return jwt || extractToken(req);
};

const jwtOptions = {
  secretOrKey: jwtSecret,
  jwtFromRequest: cookieExtractor
  // jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
};

const jwt = async (payload: any, done: any) => {
  try {
    // const user = await User.findById(payload.id);
    const user = await User.findOne({ email: payload.email }).lean();
    if (user) return done(null, user);
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
};

export default {
  jwt: new JwtStrategy(jwtOptions, jwt)
};
