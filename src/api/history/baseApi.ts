import { IHistoryMenuDto, IHistoryFilterDto, IHistoryContentDto, IHistoryMenuEntity } from "./modelEntity"
// import { inject, InjectionKey } from "vue";
// import { ESApp } from "@extscreen/es3-vue";
import { RequestManager } from "../request/RequestManager";
import { getTestContentList, getTestFilterList } from "./mock";
import { ESLocalStorage } from "@extscreen/es3-core";

export interface IcurrentItemParams {
    index: number;
    item: { id: string, [k:string]:any }
}

export interface Iapi {
    getMenuList(): Promise<IHistoryMenuDto>
    getFilterTabList(index: number, category: IHistoryMenuEntity): Promise<IHistoryFilterDto>
    getContentList(currentMenu: IcurrentItemParams, currentFilter: IcurrentItemParams, pageNum: number): Promise<IHistoryContentDto>
    deleteContent(currentMenu: IcurrentItemParams, currentFilter: IcurrentItemParams, item:IcurrentItemParams):Promise<boolean>
    clearContent(currentMenu: IcurrentItemParams, currentFilter: IcurrentItemParams):Promise<boolean>
}

// api基类默认是mock数据，可以在子类中根据业务重写对应的方法调用接口返回数据
export class HistoryBaseApi implements Iapi {
    // @ts-ignore
    requestManager: RequestManager
    // @ts-ignore
    localStore: ESLocalStorage
    init(...params: any[]): Promise<any> {
        this.requestManager = params[0]
        this.localStore = params[1]
        return Promise.resolve()
    }
    async getMenuList(): Promise<IHistoryMenuDto> {
        return { }
    }
    async getFilterTabList(index: number, category?: IHistoryMenuEntity): Promise<IHistoryFilterDto> {
        if (index === 0 || index === 1) {
            return { data: getTestFilterList() }
        }
        return {}
    }
    async getContentList(currentMenu: IcurrentItemParams, currentFilter: IcurrentItemParams, pageNum: number): Promise<IHistoryContentDto> {
        return new Promise(resolve => {
            setTimeout(() => {
                if (currentMenu?.index === 0 && currentFilter?.index === 0 && pageNum < 5) {
                    resolve({ data: getTestContentList(20, pageNum), isNeedReload: true })
                } else if (currentMenu?.index === 0 && currentFilter?.index === 1 && pageNum < 2) {
                    resolve({ data: getTestContentList(20, pageNum), isNeedReload: true })
                } else if (currentMenu?.index === 1 && pageNum === 1) {
                    resolve({ data: getTestContentList(5, pageNum), isNeedReload: true })
                } else {
                    resolve({ data: [], isNeedReload: true })
                }
            }, 2000);
        })
    }
    async deleteContent(currentMenu: IcurrentItemParams, currentFilter: IcurrentItemParams, item:IcurrentItemParams): Promise<boolean> {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(true)
            }, 2000);
        })
    }
    async clearContent(currentMenu: IcurrentItemParams, currentFilter: IcurrentItemParams): Promise<boolean> {
        return true
    }
};

export default new HistoryBaseApi()