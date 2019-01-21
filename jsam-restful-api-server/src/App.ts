import bodyParser from 'body-parser';
import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';

import keys from './config/keys';
import { configPassport } from './config/passport';
import { Routes } from './routes/Routes';

import { mongooseErrorHandler } from './helpers/error-handlers/mongooseErrorHandler';
import { defaultErrorHandler } from './helpers/error-handlers/defaultErrorHandler';

class App {
  public expressApp: express.Application;
  public appRoutes: Routes = new Routes();

  constructor() {
    this.expressApp = express();
    this.connectToDatabase();
    this.configPreRouteMiddlewares();
    this.useRoutes();
    this.configPostRouteMiddlewares();
  }

  private configPreRouteMiddlewares(): void {
    // Config bodyParser middleware to support application/x-www-form-urlencoded & application/json POST data
    this.expressApp.use(bodyParser.urlencoded({ extended: false }));
    this.expressApp.use(bodyParser.json());

    // Config passport middleware for authentication
    this.expressApp.use(passport.initialize());
    configPassport(passport);
  }

  private configPostRouteMiddlewares(): void {
    this.expressApp.use(mongooseErrorHandler);
    this.expressApp.use(defaultErrorHandler);
  }

  private async connectToDatabase(): Promise<any> {
    const databaseURI = keys.mongoURI;

    try {
      console.log('Connecting to MongoDB...');
      await mongoose.connect(
        databaseURI,
        { useNewUrlParser: true }
      );
      console.log('MongoDB connected.');
    } catch (err) {
      console.error(err);
    }
  }

  private useRoutes(): void {
    this.appRoutes.routes(this.expressApp);
  }
}

const expressApp = new App().expressApp;

export { expressApp };

export default expressApp;
