import { RequestManager } from "../request/RequestManager";
import { IAnyobj, Iconfig } from './types'
// @ts-ignore
import { getMysection, ImySectionRes, posterTypes } from '../../pages/my/index.ts'
let dImgURL = 'https://img1.baidu.com/it/u=2666955302,2339578501&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=750';
import vipIcon from '../../assets/my/vip.png'
import orderIcon from '../../assets/my/order.png'
import collectionIcon from '../../assets/my/collection.png'
import vipIconF from '../../assets/my/vip_f.png'
import orderIconF from '../../assets/my/order_f.png'
import collectionIconF from '../../assets/my/collection_f.png'

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
      gradientBg: { colors: ['#FF00040B', '#FF1A2334'] }
    }
  }
  /**
   * 获取用户订单信息信息 - 第一个板块展示
   */
  async getOrderInfo(): Promise<ImySectionRes> {
    await delayFn()
    return getMysection({
      id: '1getOrderInfo',
      list: [
        {
          id: '0', img: orderIcon, focusedImage: orderIconF,
          focusedBgColor: {colors:['#FF0057FF','#FF00C7FF'], cornerRadii4: [20, 20, 20, 20],orientation:6},
          title: '我的订单',  _titleFontSize: 32, _infoWidthRatio: 0.9,
          _layout: { width: 348, height: 314 },
        },
        {
          id: '1', img: collectionIcon, focusedImage: collectionIconF,
          focusedBgColor: {colors:['#FF0057FF','#FF00C7FF'], cornerRadii4: [20, 20, 20, 20],orientation:6},
          title: '我的收藏',  _titleFontSize: 32, _infoWidthRatio: 0.9,
          _layout: { width: 348, height: 314 },
        },
        {
          id: '2', img: vipIcon, focusedImage: vipIconF,
          focusedBgColor: {colors:['#FFFFE398','#FFEEB364'], cornerRadii4: [20, 20, 20, 20],orientation:6},
          title: '我的会员卡',  _titleFontSize: 32, _infoWidthRatio: 0.9,
          _focusTitle: '<font color="#FF603314">我的会员卡</font>',
          _layout: { width: 348, height: 314 },
        }
      ],
      options: { posterType: posterTypes.card2 }
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
          title: '我的阿勒泰'+index,//'<font color="#92949A">title</font>',//#ffffff80
          playCount: index+'', _subTitleFontSize: 24, _titleFontSize: 32,
          allTime: 100, currentPlayTime: 50,
          _layout: { height: 230 },
          _router: { url: 'history', params: {} }
        }
      }),
      options: { columns: 4, space: 33, posterType: posterTypes.poster2 }
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
        list: ['应用信息','联系我们','时间提醒设置','播放器设置','关于本机','日志上报','用户隐私协议'].map((item,index)=>{
          return {
            id: ''+index,
            title: item, _titleFontSize: 36,
            focusedBgColor: {colors:['#FF0057FF','#FF00C7FF'], cornerRadii4: [20, 20, 20, 20],orientation:6},
            _layout: { height: 120 }
          }
        }),
        options: {
          posterType: posterTypes.btn,
          columns: 4,// 指定 columns 创建板块数据
          space: 33
        }
      })
    ]
  }
}

// {
//   id: '0', img: vipIcon,
//   title: '我的订单',  _titleFontSize: 32,
//   subTitle: '已支付的订单在这里~', _subTitleFontSize: 26,
//   _infoWidthRatio: 0.9,
//   _layout: { width: 348, height: 314 },
// },