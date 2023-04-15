import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import passport from 'passport';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import strategies from './passport';
import routes from '../api/routes/index';
// import error from '../middlewares/error';
import vars from './vars';
import { getUser, handleSpaceJwt } from '../middlewares/auth';
import { handleOrganization } from '../middlewares/handleQuery';
import fileUpload from 'express-fileupload';
import logger from './logger';
import { RequestCustom } from '../types/custom-express/express-custom';

/**
 * Express instance
 * @public
 */
const app = express();
// request logging. dev: console | production: file
app.enable('trust proxy');
app.use(morgan(vars.logs));

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

// parse cookie
app.use(cookieParser());
app.use((req, res, next) => {
  console.log(JSON.stringify(req.cookies, null, 2));
  next();
});
// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors({ credentials: true, origin: true }));

// enable authentication
app.use(passport.initialize());
passport.use('jwt', strategies.jwt);
passport.use('handleSpaceJwt', strategies.handleSpaceJwt);

app.use(getUser());
app.use(handleSpaceJwt());
app.use((req: RequestCustom, res, next) => {
  // console.log(JSON.stringify(req.cookies, null, 2));
  console.log(req.space);
  next();
});

app.use(handleOrganization());
// mount api v1 routes
app.use('/api/v1', routes);

// if error is not an instanceOf APIError, convert it.
// app.use(error.converter);

// catch 404 and forward to error handler
// app.use(error.notFound);

// error handler, send stacktrace only during development
// app.use(error.handler);
export default app;
