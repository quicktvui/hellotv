import myDataManager, { getMysection, ImySectionRes, posterTypes, VipInfo } from '../../pages/my/my-data-manager'
import ic_vip_normal from '../../assets/my/ic_vip_normal.png'
import ic_collect_normal from '../../assets/my/ic_collect_normal.png'
import ic_collect_focus from '../../assets/my/ic_collect_focus.png'
import ic_order_normal from '../../assets/my/ic_order_normal.png'
import ic_order_focus from '../../assets/my/ic_order_focus.png'
import requestManager from '../../tools/request'
import { getUserAccountList, urlGetAgreementConfig, urlGetLongHistory } from '../user/request-url'
import launch from '../../tools/launch'
import buildConfig from '../../config/build-config'
import { UserInfo } from '../user/impl-user'
import BuildConfig from '../../config/build-config'
import { getHistorySubTitle } from '../../tools/common'

class MyAPi {
  /**
   * 加载初始化数据
   * @param routerParams 当前页面的路由参数对象
   */
  async initPageData(routerParams: any): Promise<any> {
    return {}
  }
  /**
   * 获取用户订单信息信息 - 第一个板块展示
   */
  getCenterInfo(vipInfo: VipInfo, info: UserInfo | null): ImySectionRes {
    return getMysection({
      id: '1getOrderInfo',
      title: '个人中心',
      list: [
        {
          id: '1',
          title: vipInfo.isVip ? '续费会员' : '开通会员',
          img: 'file://' + ic_vip_normal,
          _titleFontSize: 36,
          _titleFontColor: '#F3DFB2',
          _iconWidth: 100,
          _iconHeight: 88,
          _layout: { width: 361, height: 314 },
          jumpParams: { type: 0, options: '' },
          tip: vipInfo.isVip ? '有效期至 ' + vipInfo.endTime : ' '
        },
        {
          id: '2',
          title: '我的收藏',
          img: 'file://' + ic_collect_normal,
          focusedImage: 'file://' + ic_collect_focus,
          _titleFontSize: 36,
          _titleFontColor: '#FFFFFF',
          _iconWidth: 100,
          _iconHeight: 88,
          _layout: { width: 361, height: 314 },
          jumpParams: { type: 1, options: { name: 'history', params: { menuIndex: 1 } } },
          tip: ' '
        },
        {
          id: '3',
          title: '我的订单',
          img: 'file://' + ic_order_normal,
          focusedImage: 'file://' + ic_order_focus,
          _titleFontSize: 36,
          _titleFontColor: '#FFFFFF',
          _iconWidth: 100,
          _iconHeight: 88,
          _layout: { width: 361, height: 314 },
          jumpParams: { type: 1, options: '' },
          tip: ' '
        }
      ],
      options: { posterType: posterTypes.card2, blockTitleTop: 80, blockTitleBottom: 40 }
    })
  }
  async getHistorys(): Promise<ImySectionRes> {
    return getMysection({
      id: '2getHistorys',
      title: '播放记录',
      list: [
        {
          id: '1413407917851279361',
          img: 'https://extcdn.hsrc.tv/project/zero/img_test/2021/01/09a8dbc000-c10d-4c4c-9694-106245c6bbfb.jpg',
          _redirectType: 1,
          title: '金龟子',
          subTitle: '',
          _subTitleFontSize: 24,
          _titleFontSize: 30,
          _layout: { height: 230 },
          jumpParams: {
            type: 1,
            options: {
              name: 'series_view',
              params: {
                mediaId: '1413407917851279361'
              }
            }
          }
        }
      ],
      options: { columns: 4, space: 35, posterType: posterTypes.poster, itemPadding: 8, blockTitleBottom: 40 }
    })
  }

  /**
   * 获取更多板块信息
   */
  async getMoreList(agreementConfigList: any[]): Promise<ImySectionRes[]> {
    console.log('agreementConfigList:' + JSON.stringify(agreementConfigList))
    return [
      getMysection({
        id: '3getMoreList',
        title: '其他设置',
        list: [
          {
            id: '0',
            title: '相关信息',
            _titleFontSize: 36,
            _layout: { width: 410, height: 120 },
            jumpParams: { type: 1, options: { name: 'device_info' } }
          },
          {
            id: '1',
            title: '联系我们',
            _titleFontSize: 36,
            _layout: { width: 410, height: 120 },
            jumpParams: { type: 1, options: '' }
          },
          ...agreementConfigList.map((e) => ({
            id: e.code,
            title: e.name,
            _titleFontSize: 36,
            _layout: { width: 410, height: 120 },
            jumpParams: {
              type: 1,
              options: {
                name: 'load_web_view',
                params: {
                  html: e.url
                }
              }
            }
          }))
        ],
        options: {
          posterType: posterTypes.info,
          columns: 4, // 指定 columns 创建板块数据
          space: 40,
          blockTitleBottom: 40
        }
      })
    ]
  }
  //获取用户Vip信息
  async getVipInfo(): Promise<VipInfo> {
    return Promise.resolve({
      isVip: false,
      endTime: '00:00:00',
      endDateTime: '20250410'
    })
  }
  async getMyHistory() {
    return requestManager.post(urlGetLongHistory, { param: { pageSize: 3 } }).then((historyList: any) => {
      return historyList
    })
  }
  async getAgreementConfig() {
    return requestManager.post(urlGetAgreementConfig, {}).then((agreementConfig: any) => {
      return agreementConfig
    })
  }
}

const myApi = new MyAPi()
export default myApi
