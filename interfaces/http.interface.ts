export interface IHttpQueryPage {
    q?: string;
    sort?: string;
    limit?: number;
    offset?: number;
    category?: string;
}

export interface IHttpResponse {
    query?: string;
    paging?: any;
    results?: Array<any>;
    available_sorts?: Array<any>;
    available_filters?: Array<any>;
}