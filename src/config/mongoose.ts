import mongoose from 'mongoose';
import logger from './logger';
require('../models/user.model');
require('../models/item.model');
require('../models/tripHistory.model');
import vars from './vars';

// Set mongoose Promise to Bluebird
// eslint-disable-next-line no-undef
mongoose.Promise = Promise;

// Exit Applicatioin on Error
mongoose.connection.on('error', (err: object | string) => {
  logger.error(`Mongoose connection error: ${err}`);
  process.exit(-1);
});

// Print mongoose logs in dev env
if (process.env.NODE_ENV === 'dev') {
  // mongoose.set('debug', true)
}

export default {
  connect: () => {
    mongoose
      .connect(vars.mongo.uri)
      .then(() => {
        logger.info('Connected to DB!');
      })
      .catch((err: object | string) =>
        logger.error(
          `ERROR CONNECTING TO MONGO\n${err}. mongoURI: ${vars.mongo.uri}`
        )
      );
  }
};
