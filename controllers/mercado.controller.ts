import axios from 'axios';
import { Request, Response } from 'express';
import { maxItemBuffer, urlBase } from '../conf';
import { IHttpQueryPage, IHttpResponse } from '../interfaces/http.interface';

import { IBufferItem, IBufferLocal } from '../interfaces/mercado.interface';

import writeJson from 'write-json-file';
import * as path from 'path';
import fs from 'fs';

const get = async (req: Request, res: Response) => {
    const query: IHttpQueryPage = req.query;

    let bufferSearch: IBufferItem []  = [];
    let queryApiMercado = '';
    let bufferLocation = '';

    let status = 200;

    let q='', sort='', category='', limit = 0, offset = 0;

    if (query.hasOwnProperty('q')) {
        queryApiMercado += `q=${ query.q }`;
        q = query.q ? query.q : '';
    }
    if (query.hasOwnProperty('sort')) {
        queryApiMercado += `&sort=${ query.sort }`;
        sort = query.sort ? query.sort : '';
    }
    if (query.hasOwnProperty('category')) {
        queryApiMercado += `&category=${ query.category }`;
        category = query.category ? query.category : '';
    }

    limit = query.limit ? query.limit : 30;
    offset = query.offset ? query.offset : 0;

    queryApiMercado += `&limit=${ query.limit ? query.limit : 30 }`;
    queryApiMercado += `&offset=${ query.offset ? query.offset : 0 }`;
    
    const defaultAtt = ['q', 'sort', 'limit', 'offset'];
    Object.entries(query).forEach( ([key, value]) => {
        if(!defaultAtt.find( v => v === key)) {
            queryApiMercado += `&${ key }=${ value }`;
        }
    });

    bufferLocation = path.resolve(__dirname, '../data/search-buffer.json');

    let dataBuffer = await getFile(bufferLocation) as IBufferLocal;
    if(dataBuffer.search && dataBuffer.search.length > 0) {
        bufferSearch = dataBuffer.search;
    }
    let data: IHttpResponse= {};
    const dataLocal = bufferSearch.find( b => (b.query === q && b.sort === sort && b.category === category && b.limit === limit && b.offset === offset));
    if(!dataLocal) {
        console.log('❌', 'Not buffer');    

        const itemsMercado = await axios.get(`${ urlBase }/search?${ queryApiMercado }`)
        
        if(itemsMercado.data) {
            const dataResult = [];
            if(itemsMercado.data.query) {
                data.query = itemsMercado.data.query;
            }
            if(itemsMercado.data.paging) {
                data.paging = itemsMercado.data.paging;
            }
            if(itemsMercado.data.results) {
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

            // writer in buffer, max = 3 searchs        
            bufferSearch.push({ 
                query: q, sort, category, limit, offset, 
                results: dataResult,
                paging: data.paging,
                available_sorts: data.available_sorts,
                available_filters: data.available_filters
             });
            if(bufferSearch.length > maxItemBuffer) {
                bufferSearch.shift();
            }
            await writeJson(bufferLocation, { "search": bufferSearch });

            status = itemsMercado.status;
        }    
    } else {
        console.log('🟢', 'local buffer');
        data = dataLocal as IBufferItem;
    }
    return res.status(status).json({
        status: true,
        data
    });
};

const getFile = async (bufferLocation: string) => {
    let dataBuffer = {};
    if(fs.existsSync(bufferLocation)) {
        const file = fs.readFileSync(bufferLocation);
        try {
            if(file && file.toString() !== '') {
                dataBuffer = JSON.parse(file.toString());
            }            
        } catch (error) {}        
    }    
    return dataBuffer;
}

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
