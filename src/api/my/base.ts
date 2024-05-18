import { RequestManager } from "../request/RequestManager";
import { IAnyobj, Iconfig, ImyBlock } from './types'


export class MyBase {
  requestManager: RequestManager|undefined;
  pageData: IAnyobj | undefined;

  /**
   * 加载初始化数据
   * @param routerParams 当前页面的路由参数对象
   */
  async initPageData(routerParams: IAnyobj): Promise<any> {
      return {}
  }
  /**
   * 获取页面配置信息
   */
  async getConfig(): Promise<Iconfig> {
      return {
        bgColor: '#ffffff'
      }
  }
  /**
   * 获取用户信息 - 第一个板块展示
   */
  async getUserInfo(): Promise<ImyBlock[]> {
      return []
  }
  /**
   * 获取历史记录信息
   */
  async getHistorys(): Promise<ImyBlock[]> {
      return []
  }
  /**
   * 获取更多板块信息
   */
  async getMoreList(): Promise<ImyBlock[]> {
      return []
  }
}