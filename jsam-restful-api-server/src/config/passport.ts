import { PassportStatic } from 'passport';
import { ExtractJwt, JwtFromRequestFunction, Strategy as JwtStrategy } from 'passport-jwt';

import { keys } from './keys';
import { UserModel } from '../models/User';

interface IStrategyOptions {
  jwtFromRequest: JwtFromRequestFunction;
  secretOrKey: string;
}

const strategyOptions: IStrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: keys.secretOrKey
};

const configPassport = (passport: PassportStatic) => {
  passport.use(
    new JwtStrategy(strategyOptions, (jwtPayload, done) => {
      try {
        const user = UserModel.findById(jwtPayload.id);
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      } catch (err) {
        console.log(err);
      }
    })
  );
};

export { configPassport };

export default configPassport;
