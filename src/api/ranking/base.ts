import { RequestManager } from "../request/RequestManager";
import { IrankingConfig, IrankingTabItem, IrankingContent, IrankingMoreContent } from "./types";

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
      pageSpace: 96, topHeight: 60,
      gradientBg: { colors: ['#0E0E0E','#0E0E0E'] }
    }
  }

  /**
   * 获取tab栏数据
   */
  async getTabData(): Promise<IrankingTabItem[]>{
    return new Array(7).fill(1).map((_,index)=>{
      return { id: index+'',text: index+'排行榜' }
    })
  }

  /**
   * 获取内容数据
   */
  async getContentData(pageIndex: number):Promise<IrankingContent|IrankingMoreContent>{
    return {
      type: '1', rankName: '热门榜' + pageIndex,
      list: [
        {
          previewImg: 'http://lexueimg.educdn.huan.tv/eduImg/upload/img5/20210709105200002.png',
          poster: 'http://lexueimg.educdn.huan.tv/eduImg/upload/img5/20210709105200002.png',
          bgTags: [{id:'1',txt:'会员抢先'}],
          // titleImg: 'http://lexueimg.educdn.huan.tv/eduImg/upload/img5/20210709105200002.png',
          title: '2022最美的夜bilibili晚会',
          // subTitle: '间谍过家家',
          tagStr: '日常｜搞笑｜战斗 跟新至第24话',
          score: '9.7分',
          // des: '豆瓣飚分9.2，口碑逆天！年度霸权回归后半部开播！星光阿尼亚回归星光阿尼亚回归星光阿尼亚回归星光阿尼亚回归！'
        }
      ]
    }
  }
}