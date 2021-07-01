import { IHttpResponse } from "./http.interface";

export interface IBufferItem extends IHttpResponse {
    sort?: string;
    category?: string;
    limit?: number;
    offset: number;
    results?: Array<any>;
    filterQry?: Array<any>;
}

export interface IBufferLocal {
    search?: Array<IBufferItem>;
}