import { Router } from 'express';
import { check } from 'express-validator';
import helperField from '../helpers/helper-field';

import mercadoCtrl from '../controllers/mercado.controller';

const mercadoRouter = Router();

    mercadoRouter.get('/', [ 
            check('q', 'El Query de búsqueda es requerido').not().isEmpty(),
            check('limit', 'El valor del límite debe ser un número').optional().isNumeric(),
            check('offset', 'El valor del límite debe ser un número').optional().isNumeric(),
            check('sort').optional().isIn(['price_asc', 'price_desc']).withMessage('El ordenamiento solo puede recibir los valores: price_asc  y price_desc'),
            helperField.validationField,
        ] , mercadoCtrl.get
    );

    mercadoRouter.get('/categories', mercadoCtrl.getCatgories);

    mercadoRouter.get('/categories/:id', mercadoCtrl.getCatgory
    );

export default mercadoRouter;