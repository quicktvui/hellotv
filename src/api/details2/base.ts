import { RequestManager } from "../request/RequestManager";
import {IDetail2Config,IAnyobj, Id2TopData, IvideoDes} from './types'
import homeIcon from '../../assets/ic_header_home.png'
import homeIconf from '../../assets/ic_header_home_focus.png'
import logo from '../../assets/ic_media_vip_button_focused.png'
import searchIcon from '../../assets/ic_top_search.png'
import searchIconf from '../../assets/ic_top_search_focus.png'
import fullIcon from '../../assets/ic_media_full_button_normal.png'
import fullIconf from '../../assets/ic_media_full_button_focused.png'
import vipIconf from '../../assets/my/vip_f.png'
import logo2 from '../../assets/ic_seekbar.png'

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
    return {
      isShowTop: true
    }
  }
  /**
   * 获取顶部栏数据
   */
  async getTopList(): Promise<Id2TopData> {
    return {
      logo: { title: '云视听', titleIcon:logo },
      btns: [
        { id: 1, text: '搜索：亨利·卡维尔', lIcon:searchIcon, lIconf: searchIconf },
        { id: 2, text: '首页', lIcon:homeIcon, lIconf:homeIconf },
        { id: 3, text: '全部电影', lIcon:homeIcon, lIconf:homeIconf },
      ]
    }
  }
  /**
   * 获取视频介绍信息数据
   */
  async getVideoDes():Promise<IvideoDes>{
    return {
      title: '福尔摩斯小姐：伦敦厄运 Enola Holmes', topDistance: 40,
      // des: '这部电影的名字是Enola Holmes(伊诺拉·福尔摩斯),也就是电影中文译名福尔摩斯小姐真正的名字。电影改编自南希·斯普林格Nancy',
      tags: [
        { id: 1, txt: '8.1分', gap: 10, color: 'red' },
        { id: 2, txt: '剧情', mode: 'tag', gap: 10, color: 'orangered', bgColor:'rgba(228, 120, 19, 0.1)', borderColor:'rgba(236, 11, 11, 0.1)' },
        { id: 3, txt: '动作', showSplit:true },
        { id: 4, txt: '悬疑', showSplit:true },
        { id: 5, txt: '冒险', gap: 20 },
        { id: 6, txt: '会员专享', mode: 'btn' },
      ],
      actions: [
        { id: 1, txt: '全屏观看', type: 1, icon: fullIcon, iconf: fullIconf },
        { id: 2, txt: '视频详情', type: 1, icon: fullIcon, iconf: fullIconf, gradientBg:{colors:['#00C7FF','#0057FF'], cornerRadii4: [9, 9, 9, 9],orientation:6},gradientBgf:{colors:['#FFE398','#EEB364'], cornerRadii4: [9, 9, 9, 9],orientation:6} },
        { id: 3, txt: '热门电影榜', type: 1, icon: fullIcon, iconf: fullIconf },
        { 
          id: 4, txt: '开通会员', type: 2, icon: vipIconf,
          gradientBg: {colors:['#FFE398','#EEB364'], cornerRadii4: [9, 9, 9, 9],orientation:6},
          vipDuration: '月度会员', price: 100, oPrice: 200
        },
        { 
          id: 4, txt: '开通会员', type: 3, img: logo2
        }
      ]
    }
  }
}