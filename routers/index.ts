import { Router, Request, Response } from 'express';

import * as confg from '../conf';

import mercadoRouter from './mercado.router';
import * as path from 'path';


const routers = Router();

routers.use(`${confg.apiBase}/search`, mercadoRouter);

routers.get('*', (req: Request, res: Response) => {
    res.sendFile( path.resolve(__dirname, '../public/index.html'));
});

export default routers;
