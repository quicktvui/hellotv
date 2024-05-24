import { RequestManager } from "../request/RequestManager";
import { IAnyobj, Iconfig } from './types'
// @ts-ignore
import { getMysection, ImySectionRes, posterTypes } from '../../pages/my/index.ts'
let dImgURL = 'https://img1.baidu.com/it/u=2666955302,2339578501&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=750';
import vimIcon from '../../assets/my/vip.png'
import infoIcon from '../../assets/my/info.png'
import logo from '../../assets/cell-list-focus-img.png'

const delayFn = ()=>{
  return new Promise(resolve=>{
    setTimeout(() => {
      resolve(true)
    }, 1000);
  })
}
export class MyBase {
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
  async getConfig(): Promise<Iconfig> {
    return {
      gradientBg: { colors: ['#FF2F3541', '#FF252930'] },
      headerLogo: logo
    }
  }
  /**
   * 获取用户订单信息信息 - 第一个板块展示
   */
  async getOrderInfo(): Promise<ImySectionRes> {
    await delayFn()
    return getMysection({
      id: '1getOrderInfo',
      list: [1, 2, 3].map((item, index) => {
        return {
          id: index + '', img: vimIcon,
          title: index+'我的订单',  _titleFontSize: 32,
          subTitle: index+'-已支付的订单在这里~', _subTitleFontSize: 26,
          _infoWidthRatio: 0.9,
          _layout: { width: 358, height: 230 },
        }
      }),
      options: { posterType: posterTypes.card }
    })
  }
  /**
   * 获取历史记录信息
   */
  async getHistorys(): Promise<ImySectionRes> {
    await delayFn()
    return getMysection({
      id: '2getHistorys', title: '历史记录',
      list: [1, 2, 3, 4, 5].map((item, index) => {
        return {
          id: index + '', img: dImgURL, _redirectType: 1,
          title: '<font color="#92949A">title</font>',//#ffffff80
          _focusTitle: 'title',
          // subTitle: index+'-sub', _subTitleFontSize: 30,
          _layout: { height: 228 },
          _router: { url: 'history', params: {} }
        }
      }),
      options: { columns: 4 }
    })
  }
  /**
   * 获取更多板块信息
   */
  async getMoreList(): Promise<ImySectionRes[]> {
    await delayFn()
    return [
      getMysection({
        id: '3getMoreList', title: '更多功能',
        list: [1, 2].map((item, index) => {
          return {
            id: index + '', img: infoIcon,
            title: '应用信息', _titleFontSize: 32,
            _layout: { height: 175 },
            cornerNum: index === 1 ? -1 : undefined
          }
        }),
        options: {
          posterType: posterTypes.info, columns: 6// 指定 columns 创建板块数据
        }
      })
    ]
  }
}