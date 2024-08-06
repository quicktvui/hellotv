import { RequestManager } from "../request/RequestManager";
import { IAnyobj, Iconfig } from './types'
// @ts-ignore
import { getMysection, ImySectionRes, posterTypes } from '../../pages/my/index.ts'
import vipIcon from '../../assets/my/vip.png'
import orderIcon from '../../assets/my/order.png'
import collectionIcon from '../../assets/my/collection.png'
import vipIconF from '../../assets/my/vip.png'
import orderIconF from '../../assets/my/order_f.png'
import collectionIconF from '../../assets/my/collection_f.png'
// @ts-ignore
import historyApi from '../history/index.ts'
// @ts-ignore
import { launchRedirectType } from "../../tools/launch/Launch.ts";

const dHistoryIds = '_'
export class MyBase {
  requestManager: RequestManager | undefined;
  pageData: IAnyobj | undefined;

  loginRouter = 'login'
  historyIds = dHistoryIds

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
      gradientBg: { colors: ['#FF00040B', '#FF1A2334'] }
    }
  }
  /**
   * 获取用户订单信息信息 - 第一个板块展示
   */
  async getOrderInfo(): Promise<ImySectionRes> {
    const focusedBgColor = {colors:['#ffffff','#ffffff'], cornerRadii4: [16, 16, 16, 16],orientation:6}

    return getMysection({
      id: '1getOrderInfo',
      list: [
        {
          id: '0', img: orderIcon, focusedImage: orderIcon,
          focusedBgColor, title: '我的订单',  _titleFontSize: 32, _infoWidthRatio: 0.9,
          _layout: { width: 348, height: 314 },
          _iconHeight: 90, _iconWidth: 90,
        },
        {
          id: '1', img: collectionIcon, focusedImage: collectionIcon,
          focusedBgColor, title: '我的收藏',  _titleFontSize: 32, _infoWidthRatio: 0.9,
          _layout: { width: 348, height: 314 },
          _iconHeight: 90, _iconWidth: 90,
          _router: { url: 'history', params: { focusMenuIndex: 1 }, isMyRouter:true }
        },
        {
          id: '2', img: vipIcon, focusedImage: vipIcon,
          focusedBgColor, title: '<font color="#FFF078">购买会员</font>',  _titleFontSize: 32, _infoWidthRatio: 0.9,
          _focusTitle: '<font color="#023B2B">购买会员</font>',//我的会员卡
          _layout: { width: 348, height: 314 },
          _iconHeight: 147, _iconWidth: 147
        }
      ],
      options: { posterType: posterTypes.card2, blockTitleTop: 0 }
    })
  }
  /**
   * 获取历史记录信息
   */
  async getHistorys(isUpdate=false): Promise<ImySectionRes|null> {
    const hisList = await historyApi.getCatchData()
    const _historyIds = hisList.reduce((p, c)=>{ return p+c.id+c.playcount },'')
    if(isUpdate){
      if(this.historyIds === _historyIds){
        return null
      }
      if(!_historyIds && this.historyIds==dHistoryIds){
        return null
      }
    }

    this.historyIds = _historyIds||dHistoryIds
    return getMysection({
      id: '2getHistorys', title: '历史记录',
      list: hisList.map((item, index) => {
        return {
          id: item.id + index + '', img: item.assetLongCoverH, _redirectType: 1,
          title: item.assetLongTitle,//'<font color="#92949A">title</font>',//#ffffff80
          subTitle: item.subTitle,
          playCount: item.playcount, //index+'',
          _subTitleFontSize: 24, _titleFontSize: 32,
          allTime: 100, currentPlayTime: 50,
          _layout: { height: 230 },
          _router: { url: 'series_view', params: {
            pid: item.customProp?.packageid,
            keyId: item.customProp?.classkeyid,
            classId: item.customProp?.classid
          } }
        }
      }),
      options: { columns: 4, space: 35, posterType: posterTypes.poster, itemPadding: 8, blockTitleBottom: 30 }
    })
  }
  async getVipConfig():Promise<ImySectionRes>{
    const focusedBgColor = {colors:['#ffffff','#ffffff'], cornerRadii4: [16, 16, 16, 16],orientation:6}

    return getMysection({
      id: '3getMoreList', title: '会员中心',
      list: [
        {
          id: '0',
          title: '学前会员', _titleFontSize: 36,
          focusedBgColor, _layout: { height: 120 }
        },
        {
          id: '0',
          title: '小学会员', _titleFontSize: 36,
          focusedBgColor,_layout: { height: 120 }
        },
        {
          id: '0',
          title: '初中会员', _titleFontSize: 36,
          focusedBgColor, _layout: { height: 120 }
        },
        {
          id: '0',
          title: '高中会员', _titleFontSize: 36,
          focusedBgColor, _layout: { height: 120 }
        }
      ],
      options: {
        posterType: posterTypes.btn,
        columns: 4,// 指定 columns 创建板块数据
        space: 33
      }
    })
  }
  /**
   * 获取更多板块信息
   */
  async getMoreList(): Promise<ImySectionRes[]> {
    const focusedBgColor = {colors:['#ffffff','#ffffff'], cornerRadii4: [16, 16, 16, 16],orientation:6}
    return [
      getMysection({
        id: '3getMoreList', title: '其他设置',
        list: [
          {
            id: '0',
            title: '帮助中心', _titleFontSize: 36,
            focusedBgColor, _layout: { height: 120 },
          },
          {
            id: '1',
            title: '联系我们', _titleFontSize: 36,
            focusedBgColor, _layout: { height: 120 },
          },
          {
            id: '3',
            title: '播放设置', _titleFontSize: 36,
            focusedBgColor, _layout: { height: 120 },
          },
          {
            id: '4',
            title: '关于本机', _titleFontSize: 36,
            focusedBgColor, _layout: { height: 120 },
          },
          {
            id: '5',
            title: '日志上报', _titleFontSize: 36,
            focusedBgColor, _layout: { height: 120 },
            _redirectType: launchRedirectType.lexue,
          },
          {
            id: '6',
            title: '用户隐私协议', _titleFontSize: 36,
            focusedBgColor, _layout: { height: 120 },
          },
          {
            id: '7',
            title: '隐私政策', _titleFontSize: 36,
            focusedBgColor, _layout: { height: 120 },
          }
        ],
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
