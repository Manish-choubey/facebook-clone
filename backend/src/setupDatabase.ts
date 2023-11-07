import mongoose from "mongoose";
import {config} from './config'
import Logger from 'bunyan'

const log:Logger = config.createLogger('setUpdata')

export default ()=>{
    const CONNECT = ()=>{
        mongoose.connect(`${config.DATABASE_URL}`)
        .then(()=>{
            log.info('succesfully connectedto database')

        }).catch((error)=>{
        log.info('Error to connecting database',error)
        return process.exit(1)
        })

        }
        CONNECT()
        
    }

