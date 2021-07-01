
import express, {Request, Response, NextFunction} from 'express';
import { HttpError } from 'http-errors';
import cors from 'cors';

import * as path from 'path';

import routers from './routers/index';

export default class Server {
    public app: express.Application;
    public port: number;

    constructor(port: number) {
        this.port = port;
        this.app = express();
    }

    static init( port: number) {
        return new Server( port );
    }

    private publicFolder() {
        const publicPath = path.resolve(__dirname, '/public');
        this.app.use( express.static( publicPath ));
    }

    start( callback: any) {
        this.app.use( cors() );
        this.app.use( express.json() );

        this.app.use( routers );

        this.app.use( (err: HttpError, req: Request, res: Response, next: NextFunction) => {
            console.log('Error stack');
            console.error(err.stack);
            if(err.type === 'entity.parse.failed') {
                res.status(err.statusCode).send({ error: 'XML mal formado', body: err.body});
            } else if (err.statusCode && err.body) {
                res.status(err.statusCode).send({ error: err.body});
            }            
            next(err);
        });
        this.app.use( (err: HttpError, req: Request, res: Response, next: NextFunction) => {
            if( req.xhr) {
                res.status(500).send({ error: 'Servidor ha fallado'});
            } else {
                console.log('Error xhr');
                next(err);
            }
        });
        this.app.use( (err: HttpError, req: Request, res: Response, next: NextFunction) => {
            
            if( res.headersSent ) {
                return next(err);
            }
            res.status(500);
            res.render('error', { error: err });
        });

        this.app.listen( this.port, callback );
        this.publicFolder();
    }
}
