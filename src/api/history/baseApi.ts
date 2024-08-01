import { IHistoryMenuDto, IHistoryFilterDto, IHistoryContentDto, IHistoryMenuEntity,IHistoryContentEntity,IHistoryApiEntity } from "./modelEntity"
// import { inject, InjectionKey } from "vue";
// import { ESApp } from "@extscreen/es3-vue";
import { RequestManager } from "../request/RequestManager";
import { getTestContentList, getTestFilterList } from "./mock";
import { ESLocalStorage } from "@extscreen/es3-core";

export interface IcurrentItemParams {
    index: number;
    item: { id: string, [k:string]:any }
}

// api基类默认是mock数据，可以在子类中根据业务重写对应的方法调用接口返回数据
export class HistoryBaseApi {
    // @ts-ignore
    requestManager: RequestManager
    // @ts-ignore
    localStore: ESLocalStorage

    catchData:IHistoryContentEntity[] = []
    isListenerUser = false
    isUpdateingInitData = false
    isChangedData = false
    cancelCollectionId:number|null = null

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
    async initCatchData(){
        const apiRes = await this.getContentList({index:0,item:{id:'-'}},{index:0,item:{id:'-'}},1)
        this.catchData = apiRes.data||[]
        this.isUpdateingInitData = false
        return this.catchData.slice(0,3)
    }
    async getCatchData(){
        if(this.isUpdateingInitData){
            return this.initCatchData()
        }
        return this.catchData.slice(0,3)
    }
    removeCatchData(){
        this.catchData = []
    }
    /**
     * 添加历史数据
     */
    async addHistory(classKeyId:number,pid:number,musicvideoid:number,data:IHistoryApiEntity){}
    /**
     * 添加收藏数据
     */
    async addCollection(classKeyId:number,pid:number,data:IHistoryApiEntity){}
    /**
     * 检测菜单对应的内容是否有变化
     */
    checkIsChangedData(currentMenu:IcurrentItemParams):boolean{
        return true
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