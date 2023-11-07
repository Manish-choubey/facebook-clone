import express, { Express } from "express";
import { myServer } from "./setupServer";
import { config } from "./config";
import databaseconnection from "./setupDatabase";
class Application {
  public initialize(): void {
    this.loadconfig();
    databaseconnection();
    const app: Express = express();
    const server: myServer = new myServer(app);
    server.start();
  }
  private loadconfig(): void {
    config.validateConfig();
  }
}

const application: Application = new Application();
application.initialize();
