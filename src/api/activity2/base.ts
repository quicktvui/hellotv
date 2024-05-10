// @ts-ignore
import { IacTivity2GetFlexBlockRes, getActivityTopBtn, getActivity2FlexBlock } from "../../pages/activity2/index.ts";
import { RequestManager } from "../request/RequestManager";
import { ESLocalStorage } from "@extscreen/es3-core";
import { IActivityConfig, IActivityTopItemBtn, topModes } from "./types";
import homeIcon from '../../assets/ic_header_home.png'
import homeFocusIcon from '../../assets/ic_header_home_focus.png'
import vipIcon from '../../assets/ic_media_vip_button_focused.png'

export interface IAnyobj {
  [k:string]:any
}
export interface Iapi {
  /**
   * 
   * @param routerParams 当前页面的路由参数对象
   */
  initPageData(routerParams:IAnyobj): Promise<any>;// 初始化页面数据
  getConfigs(): Promise<IActivityConfig>;// 获取页面基础配置
  getTopBtns(): Promise<IActivityTopItemBtn[]>;//获取顶栏按钮数据
  getList(): Promise<IacTivity2GetFlexBlockRes[]>//获取活动板块数据
}
let dImgURL = 'https://img1.baidu.com/it/u=2666955302,2339578501&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=750';
// api基类默认是mock数据，可以在子类中根据业务重写对应的方法调用接口返回数据
export class Activity2BaseApi implements Iapi {
  // @ts-ignore
  requestManager: RequestManager
  // @ts-ignore
  localStore: ESLocalStorage
  pageData: IAnyobj|undefined = undefined

  init(...params: any[]): Promise<any> {
      this.requestManager = params[0]
      this.localStore = params[1]
      return Promise.resolve()
  }
  async initPageData(routerParams:IAnyobj): Promise<any> {
    return new Promise(resolve=>{
      setTimeout(() => {
        resolve({
          bgImg: 'https://up.deskcity.org/pic_source/28/73/cd/2873cd9dc91fa720a498b043aebd4509.jpg'
        })
      }, 1000);
    })
  }
  async getConfigs(): Promise<IActivityConfig> {
    return {
      // bgColor: {colors:['#2F3541','#252930'],cornerRadius:0},
      bgImg: this.pageData?.bgImg,
      top: {
        mode: topModes.lr,
        title: '海底冒险小剧场季卡',//海底冒险小剧场季卡
        titleStyle: { color: '#ffffff', fontSize: '50px' },
        btnListWidth: 330
      },
      banner: {
        style: { height: '600px' }
      } 
    }
  }
  async getTopBtns(): Promise<IActivityTopItemBtn[]> {
      return [
        // getActivityTopBtn({ 
        //   type: 1, text: '购买',
        //   background: ['#F9DFA7','#F9DFA7'], 
        //   focusedBackground: ['#F9DFA7','#F9DFA7'],
        //   icon: vipIcon, focusIcon:vipIcon, 
        //   textColor: '#ffffff', textFocusColor: '#ffffff',
        //   _router: { url: 'home' }
        // }),
        getActivityTopBtn({ 
          type: 1, text: '首页',
          icon: homeIcon, focusIcon:homeFocusIcon,
          _router: { url: 'home' }
        })
      ]
  }
  async getList(): Promise<IacTivity2GetFlexBlockRes[]> {
    let sectionList = [
      getActivity2FlexBlock({ 
        id: '2', title: '开学抢先学：一年级下册', 
        list: [{id: '1',_router:{ url:'home'},img:dImgURL},{id:'2',img:dImgURL},{id:'3',img:dImgURL}],
        options: { columns: 3, blackItemHeight: 260 } 
      }),
      getActivity2FlexBlock({ 
        id: '3', title: '一年级语文强化课程', list: [{id: '1',img:dImgURL},{id:'2',img:dImgURL}],
        options: { columns: 2, blackItemHeight: 400 }
      }),
      getActivity2FlexBlock({ 
        id: '4', title: '一年级数英同步课堂下册',
        list: [{id: '1',title: 'title',img:dImgURL},{id:'2',title: 'title',img:dImgURL},{id:'3',title: 'title',img:dImgURL},{id:'4',title: 'title',img:dImgURL}],
        options: { columns: 4, blackItemHeight: 260 }
      }),
      getActivity2FlexBlock({ 
        id: '5', title: '剑桥英语', 
        list: [{id: '1',img:dImgURL},{id:'2',img:dImgURL},{id:'3',img:dImgURL},{id:'4',img:dImgURL},{id:'5',img:dImgURL},{id:'6',img:dImgURL},{id:'7',img:dImgURL},{id:'8',img:dImgURL},{id:'9',img:dImgURL},{id:'10',img:dImgURL}],
        options: { columns: 6, }
      })
    ]
      return sectionList
  }
};
