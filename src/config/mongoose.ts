/* eslint-disable @typescript-eslint/no-unused-vars */
import mongoose from 'mongoose';
import logger from './logger';
import Bookmark from '../models/Bookmark';
import  Building from '../models/Building';
import  Comment from '../models/Comment';
import  Fund from '../models/Fund';
import  FundRule from '../models/FundRule';
import  Instance from '../models/Instance';
import  Proposal from '../models/Proposal';
import  Tag from '../models/Tag';
import  Thread from '../models/Thread';
import  User from '../models/User';
import  Wallet from '../models/Wallet';
import  Area from '../models/Area';
import  Owner from '../models/Owner';
import  Notification from '../models/Notification';
import  UserSetting from '../models/UserSetting';
import Space from '../models/Space';

import vars from './vars';

// Set mongoose Promise to Bluebird
// eslint-disable-next-line no-undef
mongoose.Promise = Promise;

mongoose.set('strictQuery', false);
Bookmark;
Building;
Comment;
Fund;
FundRule;
Instance;
Proposal;
Comment;
Tag;
Thread;
User;
Wallet;
Area;
Owner;
Notification;
UserSetting;
Space;

// mongoose.model('bookmarks', bookmarkSchema);
// mongoose.model('buildings', buildingSchema);
// mongoose.model('comments', commentSchema);
// mongoose.model('funds', fundSchema);
// mongoose.model('fundRules', fundRuleSchema);
// mongoose.model('instances', instanceSchema);
// mongoose.model('proposals', proposalSchema);
// mongoose.model('tags', tagSchema);
// mongoose.model('threads', threadSchema);
// mongoose.model('users', userSchema);
// mongoose.model('wallets', walletSchema);
// mongoose.model('areas', areaSchema);
// mongoose.model('owners', ownerSchema);
// mongoose.model('wallets', walletSchema);
// mongoose.model('notifications', notificationSchema);

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
        logger.info('Connected to DB! Uri:' + vars.mongo.uri);
      })
      .catch((err: object | string) =>
        logger.error(
          `ERROR CONNECTING TO MONGO\n${err}. mongoURI: ${vars.mongo.uri}`
        )
      );
  }
};

export {};
