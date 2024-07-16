import { RequestManager } from "../request/RequestManager";
import { IrankingConfig, IrankingTabItem, IrankingContent, IrankingMoreContent } from "./types";

export const imgs = ["http://lexueimg.educdn.huan.tv/eduImg/upload/img4/20230314170400041.png","http://lexueimg.educdn.huan.tv/eduImg/upload/img4/20230314170600002.png","http://lexueimg.educdn.huan.tv/eduImg/upload/img4/20230314170700015.png","http://lexueimg.educdn.huan.tv/eduImg/upload/img4/20230314170900046.png","http://lexueimg.educdn.huan.tv/eduImg/upload/img4/20230314171100011.png","http://lexueimg.educdn.huan.tv/eduImg/upload/img4/20230314171500023.png","http://lexueimg.educdn.huan.tv/eduImg/upload/img4/20230314170300055.png","http://lexueimg.educdn.huan.tv/eduImg/upload/img4/20230314170500026.png","http://lexueimg.educdn.huan.tv/eduImg/upload/img4/20230522181700013.png","http://lexueimg.educdn.huan.tv/eduImg/upload/img4/20230314170800035.png","http://lexueimg.educdn.huan.tv/eduImg/upload/img4/20230314171000032.png","http://lexueimg.educdn.huan.tv/eduImg/upload/img4/20230314171100050.png","http://lexueimg.educdn.huan.tv/eduImg/upload/img4/20230320164100051.png","http://lexueimg.educdn.huan.tv/eduImg/upload/img4/20230317114200036.png","http://lexueimg.educdn.huan.tv/eduImg/upload/img4/20230320164800025.png","http://lexueimg.educdn.huan.tv/eduImg/upload/img4/20230320165000026.png","http://lexueimg.educdn.huan.tv/eduImg/upload/img4/20230320165800057.png","http://lexueimg.educdn.huan.tv/eduImg/upload/img4/20230320170000045.png","http://lexueimg.educdn.huan.tv/eduImg/upload/img4/20230320164000026.png","http://lexueimg.educdn.huan.tv/eduImg/upload/img4/20230317114300029.png","http://lexueimg.educdn.huan.tv/eduImg/upload/img4/20230320164700025.png","http://lexueimg.educdn.huan.tv/eduImg/upload/img4/20230320164900027.png","http://lexueimg.educdn.huan.tv/eduImg/upload/img4/20230320165800007.png","http://lexueimg.educdn.huan.tv/eduImg/upload/img4/20230320165900054.png","http://lexueimg.educdn.huan.tv/eduImg/upload/img5/20230323155800049.png","http://lexueimg.educdn.huan.tv/eduImg/upload/img5/20230323155900025.png","http://lexueimg.educdn.huan.tv/eduImg/upload/img5/20230323160000053.png","http://lexueimg.educdn.huan.tv/eduImg/upload/img5/20230323160100058.png","http://lexueimg.educdn.huan.tv/eduImg/upload/img5/20230323160300026.png","http://lexueimg.educdn.huan.tv/eduImg/upload/img5/20230323160400041.png","http://lexueimg.educdn.huan.tv/eduImg/upload/img4/20230329140400007.png","http://lexueimg.educdn.huan.tv/eduImg/upload/img4/20230329140500013.png","http://lexueimg.educdn.huan.tv/eduImg/upload/img4/20230329154400033.png","http://lexueimg.educdn.huan.tv/eduImg/upload/img4/20230329140600032.png"]
const getImg = ()=>{
  const index = Math.round(Math.random() * (imgs.length-1 - 0) + 0)
  return imgs[index]
}

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
    const contentId = 'rankingContent'+pageIndex
    if(pageIndex === 0){
      return {
        id: contentId, type: '1', rankName: '',
        list: new Array(10).fill(1).map((_,index)=>{
          const pimg = getImg()
          return {
            id: contentId + '-' + index,
            previewImg: pimg,
            previewVedio: index===0?'http://qcloudcdn.a311.ottcn.com/channelzero/2024/02/05/d477660a-3eb6-4c7f-b82b-0b61c035505c.mp4':'',
            poster: pimg,
            // bgTags: [{id:'1',txt:'会员抢先'}],
            titleImg: 'http://lexueimg.educdn.huan.tv/eduImg/upload/img5/20210709105200002.png',
            // title: '2022最美的夜bilibili晚会' + index,
            subTitle: '间谍过家家',
            tagStr: '全集 1.7亿播放' + index,
            // score: `9.${index}分`,
            des: '豆瓣飚分9.2，口碑逆天！年度霸权回归后半部开播！星光阿尼亚回归星光阿尼亚回归星光阿尼亚回归星光阿尼亚回归！'
          }
        })
      }
    }
    return {
      id: contentId, type: '2', topSpace: -102,//102
      moreList: ['会员榜','翻剧榜','国创榜','电影榜','电视剧榜','纪录片榜','综艺榜'].map((mlItem,mlIndex)=>{
        return {
          id: contentId+mlIndex, type: '1', rankName: mlItem,
          list: new Array(10).fill(1).map((_,index)=>{
            const pimg = getImg()
            return {
              id: contentId+mlIndex + '-' + index,
              previewImg: pimg, previewVedio: '',
              poster: pimg,
              bgTags: [{id:'1',txt:'会员抢先'}],
              title: '2022最美的夜bilibili晚会' + mlIndex + index,
              // subTitle: '间谍过家家',
              tagStr: '日常｜搞笑｜战斗 跟新至第24话' + mlIndex + index,
              score: `${mlIndex+1}.${index}分`,
              // des: '豆瓣飚分9.2，口碑逆天！年度霸权回归后半部开播！星光阿尼亚回归星光阿尼亚回归星光阿尼亚回归星光阿尼亚回归！'
            }
          })
        }
      })
    }
  }
}