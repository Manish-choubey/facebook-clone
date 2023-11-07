
import {Application,json,urlencoded,Response,Request,NextFunction} from 'express'
import http from 'http'
import cors from 'cors'
import hpp from 'hpp'
import helmet from 'helmet'
import cookierSession from 'cookie-session';
import { Server } from 'socket.io';
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
import Logger from 'bunyan'
import HTTP_STATUS from 'http-status-codes';
import 'express-async-errors'
import compression from 'compression'
import application from './routes'


import {config} from './config'
import { CustomError, IError, IErrorResponse } from './shared/globals/helpers/error.helper'
const SERVER_PORT =5000;
const log:Logger = config.createLogger('server')


export class myServer{
private app:Application

constructor(app:Application){
    this.app = app
}

public start():void{
    this.securityMiddleware(this.app)
    this.globalErrorHandler(this.app)
    this.StanderMiddleware(this.app)
    this.routeMiddleware(this.app)
    this.startServer(this.app)
    
}
private securityMiddleware(app:Application):void{
    app.use(
        cookierSession({
            name:'session',
            keys:['config.SECRET_KEY_ONE','config.SECRET_KEY_TWO'],
            maxAge:24*7*360000,
            secure:config.NODE_ENV !=='development'
        })
    )
    app.use(hpp());
    app.use(helmet())
    app.use(cors({
        origin:config.CLIENT_URL,
        credentials:true,
        optionsSuccessStatus:200,
        methods:['GET','POST','PUT','DELETE','OPTIONS']
    }))
}
private StanderMiddleware(app:Application):void{
    app.use(compression())
    app.use(json({limit:'50mb'}))
    app.use(urlencoded({
        extended:true,limit:'50mb'
    }))
}
private routeMiddleware(app:Application):void{}
private globalErrorHandler(app:Application):void{
    app.all('*',(req:Request,res:Response)=>{
        res.status(HTTP_STATUS.NOT_FOUND).json({massage:`${req.originalUrl} not found`})
    })
    app.use((error:IErrorResponse,req:Request,res:Response,next:NextFunction)=>{
        log.error(error)
        if(error instanceof CustomError){
            return res.status(error.statusCode).json(error.serializeError())
        }

        next()

    })
}
private  async startServer(app:Application):Promise<void>{
    try{
   const httpServer:http.Server = new http.Server(app);
   const socketIo:Server =  await this.createSocketio(httpServer)
   this.startHttpServer(httpServer)
   this.socketIoConnection(socketIo)
    }catch(err){
        log.error(err)
    }
}
private async createSocketio(httpServer: http.Server): Promise<Server> {
    const io: Server = new Server(httpServer, {
        cors: {
            origin: config.CLIENT_URL,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
        }
    });
    const pubClient = createClient({ url: config.REDIS_HOST });
    const subClient = pubClient.duplicate();
    await Promise.all([pubClient.connect(), subClient.connect()]);
    io.adapter(createAdapter(pubClient, subClient));
    return io;
}

private startHttpServer (httpServer:http.Server):void{
    log.info(`Server has started with Process${process.pid}`)
       httpServer.listen(SERVER_PORT,()=>{
        log.info(`server is running on port ${SERVER_PORT}`)
       })
}

private socketIoConnection(io:Server):void{

}

}