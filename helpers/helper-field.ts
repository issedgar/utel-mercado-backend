
import { NextFunction, Request, Response } from 'express';
import { validationResult, ValidationError } from 'express-validator';

const validationField = ( req: Request, res: Response, next: NextFunction) => {
    const errorFormatter = ({ msg }: ValidationError) => {
        return {
            message: msg
        };
    };
    
    const err = validationResult( req ).formatWith(errorFormatter);
    if( !err.isEmpty()) {
        return res.status(400).send({
            message: "Error al obtener los registros en BD",
            status: false,
            errors: err.mapped()
        });
    }
    next();
};

export default {
    validationField    
};