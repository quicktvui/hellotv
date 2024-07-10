import { RequestManager } from "../request/RequestManager";
import { IrankingConfig, IrankingTabItem } from "./types";

export class RankBaseApi {
  requestManager: RequestManager | undefined;
  pageData: {[k:string]:any}|undefined;

  init(...params: any[]): Promise<any> {
    this.requestManager = params[0]
    return Promise.resolve()
  }
  /**
   * 加载初始化数据
   * @param routerParams 当前页面的路由参数对象
   */
  async initPageData(routerParams: {[k:string]:any}): Promise<any> {
    return new Promise(resolve=>{
      setTimeout(() => {
        resolve({})
      }, 1000);
    })
  }
  /**
   * 获取页面配置信息, 子类重写该方法时必须先调用父类的getConfig获取默认配置
   */
  getConfig(): IrankingConfig {
    return {
      pageSpace: 96,
      gradientBg: { colors: ['#0E0E0E','#0E0E0E'] }
    }
  }

  /**
   * 获取tab栏数据
   */
  async getTabData(): Promise<IrankingTabItem[]>{
    return new Array(7).fill(1).map((_,index)=>{
      return { text: index+'排行榜' }
    })
  }
}