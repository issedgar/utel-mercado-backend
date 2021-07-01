import axios from 'axios';
import { Request, Response, query } from 'express';
import { urlBase } from '../conf';
import { IHttpQueryPage, IHttpResponse } from '../interfaces/http.interface';


const get = async (req: Request, res: Response) => {
    const query: IHttpQueryPage = req.query;

    let queryApiMercado = '';

    if (query.hasOwnProperty('q')) {
        queryApiMercado += `q=${ query.q }`;
    }
    if (query.hasOwnProperty('sort')) {
        queryApiMercado += `&sort=${ query.sort }`;
    }
    if (query.hasOwnProperty('category')) {
        queryApiMercado += `&category=${ query.category }`;
    }    

    queryApiMercado += `&limit=${ query.limit ? query.limit : 30 }`;
    queryApiMercado += `&offset=${ query.offset ? query.offset : 0 }`;
    
    const defaultAtt = ['q', 'sort', 'limit', 'offset'];
    Object.entries(query).forEach( ([key, value]) => {
        if(!defaultAtt.find( v => v === key)) {
            queryApiMercado += `&${ key }=${ value }`;
        }
    });

    const itemsMercado = await axios.get(`${ urlBase }/search?${ queryApiMercado }`)
    let data: IHttpResponse= {};
    if(itemsMercado.data) {
        if(itemsMercado.data.query) {
            data.query = itemsMercado.data.query;
        }
        if(itemsMercado.data.paging) {
            data.paging = itemsMercado.data.paging;
        }
        if(itemsMercado.data.results) {
            const dataResult = [];
            for await (const result of itemsMercado.data.results) {
                dataResult.push({
                    id: result.id,
                    title: result.title,
                    price: result.price,
                    currency_id: result.currency_id,
                    available_quantity: result.available_quantity,
                    thumbnail: result.thumbnail,
                    condition: result.condition
                });
                
            }
            data.results = dataResult;
        }
        if(itemsMercado.data.available_sorts) {
            data.available_sorts = itemsMercado.data.available_sorts;
        }
        if(itemsMercado.data.available_filters) {
            data.available_filters = itemsMercado.data.available_filters;
        }
    }
    return res.status(itemsMercado.status).json({
        status: true,
        data
    });
};

const getCatgories = async (req: Request, res: Response) => {
    const query: IHttpQueryPage = req.query;    

    const itemsMercado = await axios.get(`${ urlBase }/categories`)
    return res.status(itemsMercado.status).json({
        status: true,
        data: itemsMercado.data
    });
};

const getCatgory = async (req: Request, res: Response) => {
    const { id } = req.params;
    
    const itemsMercado = await axios.get(`${ urlBase }/search?category=${ id }`)
    let data: IHttpResponse = {};
    if(itemsMercado.data) {
        if(itemsMercado.data.query) {
            data.query = itemsMercado.data.query;
        }
        if(itemsMercado.data.paging) {
            data.paging = itemsMercado.data.paging;
        }
        if(itemsMercado.data.results) {
            const dataResult = [];
            for await (const result of itemsMercado.data.results) {
                dataResult.push({
                    id: result.id,
                    title: result.title,
                    price: result.price,
                    currency_id: result.currency_id,
                    available_quantity: result.available_quantity,
                    thumbnail: result.thumbnail,
                    condition: result.condition
                });
                
            }
            data.results = dataResult;
        }
        if(itemsMercado.data.available_sorts) {
            data.available_sorts = itemsMercado.data.available_sorts;
        }
        if(itemsMercado.data.available_filters) {
            data.available_filters = itemsMercado.data.available_filters;
        }
    }
    return res.status(itemsMercado.status).json({
        status: true,
        data
    });
};

export default {
    get,
    getCatgories,
    getCatgory
};
