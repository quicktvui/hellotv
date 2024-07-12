import { RequestManager } from "../request/RequestManager";
import {IDetail2Config,IAnyobj} from './types'


const delayFn = ()=>{
  return new Promise(resolve=>{
    setTimeout(() => {
      resolve(true)
    }, 1000);
  })
}
export class Detail2Base {
  requestManager: RequestManager | undefined;
  pageData: IAnyobj | undefined;

  /**
   * 加载初始化数据
   * @param routerParams 当前页面的路由参数对象
   */
  async initPageData(routerParams: IAnyobj): Promise<any> {
    await delayFn()
    return {}
  }
  /**
   * 获取页面配置信息
   */
  async getConfig(): Promise<IDetail2Config> {
    return {}
  }
  /**
   * 获取用户订单信息信息 - 第一个板块展示
   */
  async getOrderInfo(): Promise<any> {
    await delayFn()
    return null
  }
}