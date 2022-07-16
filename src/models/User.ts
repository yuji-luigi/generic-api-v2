import mongoose, { Schema } from 'mongoose';
import { IUser, UserModel, UserError } from 'model/user';
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import moment from 'moment-timezone';
import jwt from 'jsonwebtoken';
import APIError from '../errors/api.error';
import autoPopulate from 'mongoose-autopopulate';
import vars from '../config/vars';

export type modules = {
  [key: string]: boolean;
  transports: boolean;
  employees: boolean;
  apartments: boolean;
  worksites: boolean;
};

const { jwtSecret/* , jwtExpirationInterval  */} = vars;
export const roles: any = ['user', 'admin', 'super_admin'];

export const userSchema = new Schema<IUser, UserModel>(
  {
    name: {
      type: String,
      required: true
    },
    surname: {
      type: String,
      required: true
    },
    role: {
      type: String,
      // enum: roles,
      required: true
    },
    email: {
      type: String,
      match: /^\S+@\S+\.\S+$/,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: false
    },
    //IN CASE MODULE FUNCTIONALITY IS NECCESSARY
    modules: {
      transports: {
        type: Boolean,
        default: false
      },
      employees: {
        type: Boolean,
        default: false
      },
      apartments: {
        type: Boolean,
        default: false
      },
      worksites: {
        type: Boolean,
        default: false
      }
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
);

// HASH PASSWORD BEFORE CREATION OF USER
userSchema.pre('save', async function save(next) {
  try {
    if (!this.isModified('password')) return next();
    const rounds = 10;
    const hash = await bcrypt.hash(this.password, rounds);
    this.password = hash;

    return next();
  } catch (error) {
    return next(error);
  }
});

// HASH PASSWORD BEFORE UPDATE OF USER
userSchema.pre('save', async function (next) {
  try {
    this.name;
    // if password is not updated
    if (!this._update.password) {
      return next();
    }

    const rounds = 10;

    const hash = await bcrypt.hash(this._update.password, rounds);
    this._update.password = hash;

    return next();
  } catch (error) {
    return next(error);
  }
});

/**
 * Methods
 */
type TransformedT = {
  [key: string]: string | Date | undefined;
};
userSchema.method({
  // metto solo i campi che mi servono(evito di mandare tutti i campi)
  transform() {
    const transformed: TransformedT = {};
    const fields = ['id', 'name', 'email', 'role', 'createdAt'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },

  token() {
    const payload = {
      // id: this._id,
      // name: this.name,
      // surname: this.surname,
      email: this.email
      // role: this.role,
      // description: this.description,
      // avatar: this.avatar,
      // locale: this.locale,
    };
    return jwt.sign(payload, jwtSecret, {
      expiresIn: '24h' // expires in 24 hours
    });
  },

  async passwordMatches(password: string) {
    return bcrypt.compare(password, this.password);
  }
});

userSchema.statics = {
  roles,
  /**
   * Find user by email and tries to generate a JWT token
   *
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  async findAndGenerateToken(options) {
    const { email, password, refreshObject } = options;
    if (!email)
      throw new APIError({
        message: 'An email is required to generate a token'
      });

    const user = await this.findOne<UserModel>({ email }).exec();
    const err: UserError = {
      status: httpStatus.UNAUTHORIZED,
      isPublic: true
    };
    if (password) {
      if (user && (await user.passwordMatches(password))) {
        return {
          user,
          accessToken: user.token()
        };
      }
      err.message = 'Incorrect email or password';
    } else if (refreshObject && refreshObject.userEmail === email) {
      if (moment(refreshObject.expires).isBefore()) {
        err.message = 'Invalid refresh token.';
      } else {
        return {
          user,
          accessToken: user.token()
        };
      }
    } else {
      err.message = 'Incorrect email or refreshToken';
    }
    throw new APIError(err);
  },

  /**
   * Return new validation error
   * if error is a mongoose duplicate key error
   *
   * @param {Error} error
   * @returns {Error|APIError}
   */
  checkDuplicateEmail(error) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
      return new APIError({
        message: 'Validation Error',
        errors: [
          {
            field: 'email',
            location: 'body',
            messages: ['"email" already exists']
          }
        ],
        status: httpStatus.CONFLICT,
        isPublic: true,
        stack: error.stack
      });
    }
    return error;
  }
};

userSchema.plugin(autoPopulate);

const UserSchema = mongoose.model('users', userSchema) as unknown;
export default UserSchema as IUser & UserModel;
