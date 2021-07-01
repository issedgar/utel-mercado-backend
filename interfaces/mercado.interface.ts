import { IHttpQueryPage } from "./http.interface";

export interface IBufferItem extends IHttpQueryPage {    
    data?: Array<any>;

}

export interface IBufferLocal {
    search?: Array<IBufferItem>;
}