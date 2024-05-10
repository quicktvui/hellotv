// @ts-ignore
import { IacTivity2GetFlexBlockRes, getActivityTopBtn, getActivity2FlexBlock } from "../../pages/activity2/index.ts";
import { RequestManager } from "../request/RequestManager";
import { ESLocalStorage } from "@extscreen/es3-core";
import { IActivityTopItemBtn } from "./types";
import homeIcon from '../../assets/ic_header_home.png'
import homeFocusIcon from '../../assets/ic_header_home_focus.png'
import vipIcon from '../../assets/ic_media_vip_button_focused.png'

export interface Iapi {
  getTopBtns(): Promise<IActivityTopItemBtn[]>;//获取顶栏按钮数据
  getList(): Promise<IacTivity2GetFlexBlockRes[]>//获取活动板块数据
}

// api基类默认是mock数据，可以在子类中根据业务重写对应的方法调用接口返回数据
export class Activity2BaseApi implements Iapi {
  // @ts-ignore
  requestManager: RequestManager
  // @ts-ignore
  localStore: ESLocalStorage
  init(...params: any[]): Promise<any> {
      this.requestManager = params[0]
      this.localStore = params[1]
      return Promise.resolve()
  }
  async getTopBtns(): Promise<IActivityTopItemBtn[]> {
      return [
        getActivityTopBtn({ 
          type: 1, text: '购买',
          background: ['#F9DFA7','#F9DFA7'], 
          focusedBackground: ['#F9DFA7','#F9DFA7'],
          icon: vipIcon, focusIcon:vipIcon, 
          textColor: '#ffffff', textFocusColor: '#ffffff',
          _router: { name: 'home' }
        }),
        getActivityTopBtn({ 
          type: 1, text: '首页',
          icon: homeIcon, focusIcon:homeFocusIcon,
          _router: { name: 'home' }
        })
      ]
  }
  async getList(): Promise<IacTivity2GetFlexBlockRes[]> {
    let sectionList = [
      getActivity2FlexBlock({ 
        id: '2', title: '开学抢先学：一年级下册', 
        list: [{id: '1',_router:{name:'home'}},{id:'2'},{id:'3'}],
        options: { columns: 3, blackItemHeight: 260 } 
      }),
      getActivity2FlexBlock({ 
        id: '3', title: '一年级语文强化课程', list: [{id: '1'},{id:'2'}],
        options: { columns: 2, blackItemHeight: 400 }
      }),
      getActivity2FlexBlock({ 
        id: '4', title: '一年级数英同步课堂下册',
        list: [{id: '1',title: 'title'},{id:'2',title: 'title'},{id:'3',title: 'title'},{id:'4',title: 'title'}],
        options: { columns: 4, blackItemHeight: 260 }
      }),
      getActivity2FlexBlock({ 
        id: '5', title: '剑桥英语', 
        list: [{id: '1'},{id:'2'},{id:'3'},{id:'4'},{id:'5'},{id:'6'},{id:'7'},{id:'8'},{id:'9'},{id:'10'}],
        options: { columns: 6, }
      })
    ]
      return sectionList
  }
};
