import {Request, Response} from 'express';
import logger from '../../config/logger';

import httpStatus from 'http-status';

import MSG from '../../utils/messages';
// import { deleteEmptyFields, getEntity } from '../../utils/functions';

//================================================================================
// CUSTOM CONTROLLER...
//================================================================================
const FUNCTION1 = async (req: Request, res: Response) => {
  try {
    res.status(httpStatus.OK).json({ message: MSG().OBJ_CREATED, data: {  } });
  } catch (err) {
    logger.error(err.message || err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message || err });
  }
};

//================================================================================
// CUSTOM CONTROLLER...
//================================================================================

export default {
  FUNCTION1
};