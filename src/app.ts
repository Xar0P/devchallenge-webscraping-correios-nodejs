import express from 'express';

import home from './routes/home';

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  }

  private middlewares() {
    this.app.use(express.json());
  }

  private routes(): void {
    this.app.get('/', home);
  }
}

export default new App().app;
