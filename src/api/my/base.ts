import { RequestManager } from "../request/RequestManager";
import { IAnyobj, Iconfig } from './types'
// @ts-ignore
import { getMysection,ImySectionRes, posterTypes } from '../../pages/my/index.ts'
let dImgURL = 'https://img1.baidu.com/it/u=2666955302,2339578501&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=750';

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
        gradientBg: { colors: ['#FF2F3541', '#FF252930'] },
      }
  }
  /**
   * 获取用户订单信息信息 - 第一个板块展示
   */
  async getOrderInfo(): Promise<ImySectionRes> {
      return getMysection({ 
        id: '1', title: '', 
        list: [
            {id: '1', img:dImgURL},
            {id: '2', img:dImgURL},
            {id: '3', img:dImgURL}
        ],
        options: { posterType: posterTypes.card }// 指定 columns 创建板块数据
    })
  }
  /**
   * 获取历史记录信息
   */
  async getHistorys(): Promise<ImySectionRes> {
      return getMysection({ 
        id: '2', title: '历史记录', 
        list: [1,2,3,4,5].map((item,index)=>{
            return {
                id: index+'', img: dImgURL, _redirectType: 1,
                title: '<font color="#92949A">颜色</font>',//#ffffff80
                _focusTitle: '颜色', _titleFontSize: 24,
                // subTitle: index+'-sub', _subTitleFontSize: 30,
                // _layout: { width: 300 },
                _router:{ url:'home', params: {} }
            }
        })
    })
  }
  /**
   * 获取更多板块信息
   */
  async getMoreList(): Promise<ImySectionRes[]> {
      return []
  }
}