/* eslint-disable @typescript-eslint/no-unused-vars */
import mongoose from 'mongoose';
import logger from './logger';
import bookmarkSchema from '../models/Bookmark';
import {buildingSchema} from '../models/Building';
import {commentSchema} from '../models/Comment';
import {fundSchema} from '../models/Fund';
import {fundRuleSchema} from '../models/FundRule';
import {instanceSchema} from '../models/Instance';
import {proposalSchema} from '../models/Proposal';
import {tagSchema} from '../models/Tag';
import {threadSchema} from '../models/Thread';
import {userSchema} from '../models/User';
import {walletSchema} from '../models/Wallet';

import vars from './vars';

// Set mongoose Promise to Bluebird
// eslint-disable-next-line no-undef
mongoose.Promise = Promise;

mongoose.model('bookmarks', bookmarkSchema);
mongoose.model('buildings', buildingSchema);
mongoose.model('comments', commentSchema);
mongoose.model('funds', fundSchema);
mongoose.model('fundRules', fundRuleSchema);
mongoose.model('instances', instanceSchema);
mongoose.model('proposals', proposalSchema);
mongoose.model('tags', tagSchema);
mongoose.model('threads', threadSchema);
mongoose.model('users', userSchema);
mongoose.model('wallets', walletSchema);

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

export {};