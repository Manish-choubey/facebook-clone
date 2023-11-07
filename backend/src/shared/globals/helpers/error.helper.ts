import HTTP_STATUS from 'http-status-codes';

export interface IErrorResponse{
    massage:string;
    statusCode:number;
    status:string
    serializeError():IError ;
}

export interface IError{
    massage:string;
    statusCode:number;
    status:string
}


export abstract class CustomError extends Error {
    abstract statusCode:number;
    abstract status:string;
    constructor(massage:string) {
        super(massage);
    }

    serializeError(): IError{
        return {
            massage:this.message,
            status:this.status,
            statusCode:this.statusCode
        }
    }
}


export class BadRequestError extends CustomError{
    statusCode = HTTP_STATUS.BAD_REQUEST
    status='error'

    constructor(massage:string){
        super(massage)
    }
}

export class NotFoundError extends CustomError{
    statusCode = HTTP_STATUS.NOT_FOUND
    status='error'

    constructor(massage:string){
        super(massage)
    }
}


export class NotAuthoriseError extends CustomError{
    statusCode = HTTP_STATUS.UNAUTHORIZED
    status='error'

    constructor(massage:string){
        super(massage)
    }
}



export class FileToLargeError extends CustomError{
    statusCode = HTTP_STATUS.REQUEST_TOO_LONG
    status='error'

    constructor(massage:string){
        super(massage)
    }
}



export class ServerError extends CustomError{
    statusCode = HTTP_STATUS.SERVICE_UNAVAILABLE
    status='error'

    constructor(massage:string){
        super(massage)
    }
}







export class JoyRequestValidationError extends CustomError{
    statusCode = HTTP_STATUS.BAD_REQUEST
    status='error'

    constructor(massage:string){
        super(massage)
    }
}