import {
  QTPoster, QTWaterfallItem,
  QTWaterfallSection,
  QTWaterfallSectionType, QTITab, QTTabPageData, QTTabPageState,
  VirtualView
} from '@quicktvui/quicktvui3';
import { Ref } from 'vue'
import myApi from '../../api/my/index';
import userManager from '../../api/login/user/UserManager'
import {UserChangeListener} from '../../api/login/user/UserChangeListener'
import { UserInfo } from "../login/build_data/UserInfo"
// import { Native } from "@extscreen/es3-vue"
import launch from '../../tools/launch/Launch';

export const activity_redirectTypes = {
  innerRouter: 1,//跳转到当前app内部页面
  innerApp: 0,//跳转到内部其他app
  test: -1
}

const dcornerGradientBg = { colors: ['#FFE398', '#EEB364'], cornerRadii4: [0, 8, 0, 8], orientation: 2, }

export const posterTypes = {
  poster: 101, card: 102, info: 103, user: 104, btn: 105, card2: 106, poster2: 107,
  logout: 108
}
export interface IBlockItemData {
  id: string
  img?: string//图片
  title?: string//标题
  subTitle?: string;//副标题，有副标题时取副标题，无副标题时取播放进度 playCount+currentPlayTime/allTime
  floatTitle?: string;//浮动标题
  corner?: string;//角标
  cornerGradientBg?: typeof dcornerGradientBg;//角标背景色
  score?: string;//评分
  cornerNum?:number;

  currentPlayTime?: number//当前播放时间-毫秒
  allTime?: number//视频总时间-毫秒
  playCount?: string//播放到第几集
  playTime?: string //播放时间(时间戳或2024-03-28 20:43:42格式字符串)

  gradientBb?: typeof dcornerGradientBg;//背景色-渐变色
  _router?: { //当前app内部路由地址
    url: string; params?: object,
    isReplace?:boolean;//是否替换当前页
    [k: string]: any
  }
  _action?: string; // 内部其他app地址
  _redirectType?: number|string;//跳转类型，取值见activity_redirectTypes
  _layout?: { x?: number; y?: number; width?: number; height?: number };
  [k: string]: any
}
interface Ioptions { //Partial
  posterWidth?: number;
  posterHeight?: number;
  imgWidth?: number;
  imgHeight?: number;
  posterBottom?: number;
  space?: number;
  posterType?: number;
  posterTitleHeight?: number;
  posterSubTitleHeight?: number;
  titleFontSize?: number,
  subTitleFontSize?: number;
  iconWidth?: number;
  iconHeight?: number
}
interface IblockOptions {
  blockTitleFontSize?: number;
  blockTitleTop?:number;
  columns?: number;
  space?: number;
  posterBottom?: number;
  posterType?: number;
  [k: string]: any
}
interface IBlockData {
  id: string;
  title?: string;
  list: IBlockItemData[];
  options?: IblockOptions
}

const titleTop = 15

const dWidth = 408
const dHeight = 228
const whRatio = dHeight / dWidth
const dPosterBottom = 30
const dPosterTitleHeight = 30
const dPosterSubTitleHeight = 25
const dTitleFontSize = 30
const dFloatTitleFontSize = 24
const dSubTitleFontSize = 24
const dSpace = 48//36
const dBlockTitleFontSize = 44
const dPadding = 0
const dColumns = 4
const dIconWidth = 80
const dIconHeight = 80
const dPosterType = posterTypes.poster
export const dPageWidth = 1920
export const dPageheight = 1080
export const dPageMarginSpace = 90 // 页面两端间距
const getSubTitle = (data: IBlockItemData) => {
  if (!data) return ''
  let subTitle = data.subTitle || ''
  try {
    if (!subTitle && data.playCount) {
      subTitle = data.playCount
      if (!isNaN(Number(data.playCount))) {
        subTitle = `第${data.playCount}集`
      }
      let progress = ''
      if (data.allTime && data.allTime > 0) {
        progress = (((data.currentPlayTime || 0) / (data.allTime || 1)) * 100).toFixed(0) + '%'
        if (Number(data.currentPlayTime) <= 0) {
          progress = '不足1%'
        }
        subTitle += ' 已看' + progress
      }
    }
  } catch (error) {

  }
  return subTitle
}
export const getPosterConfig = (data: IBlockItemData, options: IblockOptions={}): QTPoster => {
  const itemPadding = options.itemPadding || dPadding
  let space = options.space==undefined?dSpace:options.space
  const contentWidth = dPageWidth - dPageMarginSpace - (dPageMarginSpace - space)

  const subTitle = getSubTitle(data)
  const columns = options?.columns || dColumns

  let posterWidth = data._layout?.width || 0
  let posterHeight = data._layout?.height || 0
  if (!posterWidth) {
    posterWidth = Math.floor(contentWidth / columns) - space
  }
  if (!posterHeight) {
    posterHeight = posterWidth * whRatio
  }
  const imgWidth = posterWidth
  const imgHeight = posterHeight

  const ratio = imgWidth / dWidth
  const titleFontSize = data._titleFontSize || (dTitleFontSize  * ratio)
  const subTitleFontSize = data._subTitleFontSize || (dSubTitleFontSize * ratio)
  const posterTitleHeight = titleFontSize + 20
  const posterSubTitleHeight = subTitleFontSize + 20
  const iconWidth = dIconWidth * ratio;
  const iconHeight = dIconHeight * ratio
  const posterType = options.posterType || data.posterType || dPosterType || posterTypes.poster
  if (posterType === posterTypes.poster||posterType === posterTypes.poster2) {//||posterType==posterTypes.info
    if (data.title) {
      posterHeight += posterTitleHeight
    }
    if (subTitle) {
      posterHeight += posterSubTitleHeight
    }
    posterHeight += titleTop
  }

  const titleboxHeight = (data.title ? posterTitleHeight : 0) + (subTitle ? posterSubTitleHeight : 0)
  const cornerNum = data.cornerNum&&data.cornerNum>0?(data.cornerNum>99?99+'+':data.cornerNum+''):'0'
  return {
    _id: data._sectionItemId || data.id,
    _router: data._router,
    _action: data._action,
    tip: data.tip,
    focusedImageSrc: data.focusedImage||data.img,
    focusedBgColor: data.focusedBgColor,
    item: {
      redirectType: data._redirectType|| activity_redirectTypes.innerRouter,
      innerArgs: data._router?JSON.stringify(data._router):"",
    },
    _redirectType: data._redirectType || activity_redirectTypes.innerRouter,
    cornerNum, _isShowCornerNum: cornerNum !== '0',
    _isCornerNum: data.cornerNum ? true : false,
    focus: { enable: true, scale: 1.001, border: false, },
    type: posterType,//10001
    editMode: false,
    decoration: {
      left: 0,
      right: space,
      bottom: options?.posterBottom || dPosterBottom,
    },
    style: {
      width: posterWidth,
      height: posterHeight,
    },
    imageBgStyle:{
      width: imgWidth + itemPadding*2,
      height: imgHeight + itemPadding*2,
      marginTop: -itemPadding, marginLeft: -itemPadding,
    },
    image: {
      src: data.img,
      enable: !!data.img,
      style: {
        width: imgWidth,
        height: imgHeight
      },
    },
    corner: {
      text: data.corner || '',
      enable: !!data.corner,
      style: {
        width: imgWidth,
      },
      background: data.cornerGradientBg || dcornerGradientBg,
    },
    score: {
      text: data.score || '',
      enable: !!data.score,
      style: {
        width: imgWidth,
        height: 30
      },
    },
    title: {
      text: data.title || '',
      enable: !!data.title,
      style: {
        width: imgWidth,
        height: data.title ? posterTitleHeight : 0,
        fontSize: titleFontSize,
      }
    },
    focusTitle: {
      text: data._focusTitle || data.title || '',
      enable: !!(data._focusTitle || data.title)
    },
    titleBoxStyle: {
      width: posterWidth,
      height: titleboxHeight,
      marginTop: imgHeight+titleTop
    },
    titleFocuseBoxStyle: {
      width: posterWidth,
      height: titleboxHeight,
      marginTop: imgHeight - 16,
      paddingTop: 5,
    },
    bgStyle: {
      width: posterWidth,// + itemPadding*2,
      height: (posterHeight - 20),// + itemPadding,
      // marginTop: -(itemPadding+1), marginLeft: -(itemPadding+1),
    },
    coverStyle: {
      width: posterWidth,
      height: posterHeight - 20,
    },
    titleEllipsizeMode: 3,
    titleLines: 1,
    subTitle: {
      text: subTitle || '',
      enable: !!subTitle,
      style: {
        width: imgWidth,
        height: subTitle ? posterSubTitleHeight : 0,
        fontSize: subTitleFontSize
      },
    },
    floatTitle: {
      text: data.floatTitle || '',
      enable: !!data.floatTitle,
      style: {
        width: imgWidth,
      },
    },
    infoStyle: {
      width: imgWidth * (data._infoWidthRatio || 0.6)
    },
    icon: {
      style: {
        width: data._iconWidth||iconWidth, height: data._iconHeight||iconHeight
      }
    }
  }
}
export interface ImySectionRes {
  section: QTWaterfallSection;
  options?: IblockOptions;
  sectionHeight:number
}
export const getMysection = (data: IBlockData, sectionType: number = QTWaterfallSectionType.QT_WATERFALL_SECTION_TYPE_FLEX): ImySectionRes => {
  const itemPadding = data.options?.itemPadding || dPadding
  let space = data.options?.space==undefined?dSpace:data.options.space
  const contentWidth = dPageWidth - dPageMarginSpace - (dPageMarginSpace - space)
  let sectionHeight = 0
  const itemList = data.list.map((item, index) => {
    const posterData = getPosterConfig({ ...item, _sectionItemId: data.id + item.id + index }, data.options)
    // sectionHeight += (posterData.style.height||0)+(posterData.decoration?.bottom||0)
    return posterData
  })
  const blockTitleFontSize = data.options?.blockTitleFontSize || dBlockTitleFontSize
  const section: QTWaterfallSection = {
    _id: data.id,
    type: sectionType,//QT_WATERFALL_SECTION_TYPE_FLEX
    title: data.title || '',
    titleStyle: {
      marginTop: data.options?.blockTitleTop||0,
      marginBottom: data.title ? data.options?.blockTitleBottom||(20) : 1,
      fontSize: blockTitleFontSize,
      height: data.title ? blockTitleFontSize : 1,
      width: 1000,
      marginLeft: 1,
    },
    //3.构造section中item列表数据
    itemList,
    style: {
      width: contentWidth,
      height: -1,
    },
    decoration: {
      left: dPageMarginSpace,
      // right: dPageMarginSpace-space,
      top: 15,
      bottom: 5
    },
    isSwitchCellBg: '0',
    isFocusScrollTarget:false
  }
  return {
    section, options: data.options,
    sectionHeight: sectionHeight//+(section.decoration?.bottom||0)+(section.titleStyle?.height||0)+(section.titleStyle?.marginBottom||0)
  }
}

import recordIcon2 from '../../assets/my/record2.png'
// import recordIconf from '../../assets/my/record3.png'
export const transHistorySection = (_ = false, historyRes: ImySectionRes) => {
  // const isLogin =  userManager.getUserInfo()
  historyRes.section.itemList = historyRes.section.itemList.slice(0, 3)
  historyRes.section.itemList.push(getPosterConfig({
    id: 'my_history_all_btn', _id: 'my_history_all_btn',//historyRes.section._id || '' + historyRes.section.itemList.length,
    _router: { url: 'history', isMyRouter: true, isNoCheckLogin:true },
    _redirectType: activity_redirectTypes.innerRouter,
    img: recordIcon2, focusedImage: recordIcon2,
    focusedBgColor: {colors:['#ffffff','#ffffff'], cornerRadii4: [16, 16, 16, 16],orientation:6},
    title: '全部记录',//isLogin ? '全部记录' : '登录同步云端历史',
    _iconHeight: 88, _iconWidth: 88,
    _layout: { width: 408, height: 228 }, subTitle: '-'
  }, {
    space: historyRes.options?.space,
    posterType: posterTypes.info,
    itemPadding: historyRes.options?.itemPadding
  }))
  return historyRes.section
}
export const transMoreSectin = (_ = false, sections: ImySectionRes[]) => {
  // const isLogin = !!userManager.getUserInfo()
  return sections.map(item => {
    // if(item.options?.posterType === posterTypes.logout){
    //   item.section.itemList[0].type = isLogin?108:-101
    // }
    return item.section
  })
}

import dAvatar from '../../assets/my/avatar.png'
import { Native } from '@extscreen/es3-vue';
const userConfig = {
  btn: '立即登录', nickName: '未登录', tip: '登录后查看更多账号信息',
  router: { url: myApi.loginRouter, isMyRouter: true },//{ url: 'login', isReplace: false },
  loginBtn: '退出登录', loginTip: '',
  loginRouter: { url: 'logout', isReplace: false, isMyRouter: true },
}
export const getUserData = (userinfo, newInfo:UserInfo|null)=>{
  if(newInfo){
    userinfo.image.src = newInfo?.userIcon
    userinfo.title.text = newInfo?.nickName
    userinfo.subTitle.text = userConfig.loginBtn
    userinfo._router = userConfig.loginRouter,
    userinfo.tip = userConfig.loginTip
  } else {
    userinfo.image.src = dAvatar
    userinfo.title.text = userConfig.nickName
    userinfo.subTitle.text = userConfig.btn
    userinfo._router = userConfig.router
    userinfo.tip = userConfig.tip
  }
  userinfo.item.innerArgs = userinfo._router?JSON.stringify(userinfo._router):""
  return userinfo
}
export const transOrderSection = (isLogin = false, orederRes: ImySectionRes) => {
  const info =  userManager.getUserInfo()
  orederRes.section.itemList.unshift(getPosterConfig({
    id: (orederRes.section._id || 'my_userinfo' )+ orederRes.section.itemList.length,
    img: info?.userIcon||dAvatar,
    title: info?info.nickName:userConfig.nickName, tip: info?userConfig.loginTip:userConfig.tip,
    subTitle: info?userConfig.loginBtn:userConfig.btn,
    _layout: { width: 600-48, height: 314 },
    _router: info?userConfig.loginRouter:userConfig.router
  }, {
    posterType: posterTypes.user,
    space: orederRes.options?.space
  }))

  return orederRes.section
}

const transVipSectin = (res:ImySectionRes) => {
  return res.section
}
class MyDataManager {
  tabPageIndex = -1
  isUserChange = false
  isShow = false
  tabRef?:Ref<QTITab|undefined>
  lastRouter:string = ''
  triggerRouterId = ''

  async getData():Promise<QTWaterfallSection[]>{
    // const isLogin = !!userManager.getUserInfo()

    const orderRes = await myApi.getOrderInfo()
    const historyRes = await myApi.getHistorys()
    // const vipRes = await myApi.getVipConfig()
    const moreRes = await myApi.getMoreList()
    // const vipSection = transVipSectin(vipRes)
    const res = [
      transOrderSection(false, orderRes),
      transHistorySection(false, <ImySectionRes>historyRes)
    ]
    // if(isLogin){ res.push(vipSection) }
    return res.concat(transMoreSectin(false, moreRes));
  }
  async updateUser(){
    if(this.tabRef){
      const userinfo = this.tabRef.value?.getPageItem(this.tabPageIndex,0,0)
      const newInfo =  userManager.getUserInfo()
      if(userinfo?._id){
        const newUserData = getUserData(userinfo,newInfo)
        //this.tabRef.value?.getDataManager().updateItem(this.tabPageIndex,0,0,newUserData)
        //VirtualView.updateChild('homeTabs', userinfo?._id, newUserData)
        // Native.callNative('ExtendModule','callUIFunctionWithPromise', 'homeTabs','searchReplaceItem',[userinfo?._id,getUserData(userinfo,newInfo)])
        Native.callNative('ExtendModule','searchReplaceItem', userinfo?._id,getUserData(userinfo,newInfo))
      }
      // this.tabRef.value?.updatePageItem(this.tabPageIndex, 0, 0, getUserData(userinfo,newInfo))
    }
  }
  async updateHistory(){
    if(this.tabRef){
      const historyRes = await myApi.getHistorys(true)
      if(historyRes){
        const hisSection = transHistorySection(false, historyRes)
        // if(hisSection._id){
        //   // VirtualView.updateChild('homeTabs', hisSection._id, hisSection)
        //   // Native.callNative('ExtendModule','callUIFunction', 'homeTabs', 'searchReplaceItem', [hisSection._id,hisSection])
        //   Native.callNative('ExtendModule','callUIFunctionWithPromise', 'homeTabs','searchReplaceItem',[hisSection?._id,hisSection])
        // }
        this.tabRef.value?.updatePageSection(this.tabPageIndex, 1, hisSection)
        if(this.triggerRouterId && this.lastRouter=='history'){
          this.lastRouter = ''
          this.tabRef?.value?.setAutoFocus(this.triggerRouterId, 0)
        }
      }
    }
  }
  async updateData(){
    if(this.tabPageIndex>=0 && this.tabRef && this.isShow){
      const cIndex = await this.tabRef.value?.getCurrentTabIndex()
      if(cIndex === this.tabPageIndex){
        if(this.isUserChange){
          this.isUserChange = false
          this.checkRouter()
          this.updateUser()

          myApi.getMoreList().then(moreRes=>{
            const moreSections = transMoreSectin(false, moreRes)
            moreSections.forEach((mSectionItem,msIndex)=>{
              this.tabRef?.value?.updatePageSection(this.tabPageIndex, msIndex+2, mSectionItem)
            })
          })
        }
        this.updateHistory()
      }
    }
  }
  async setData(tabRef:Ref<QTITab|undefined>, tabIndex, tabContentTop = 0){
    const tData = await this.getData()
    tData[0].decoration!.top = tabContentTop
    tData[tData.length-1].decoration!.bottom = 20
    const tabPage: QTTabPageData = {
      data: tData,
      useDiff: false,
      disableScrollOnFirstScreen: false,
      isEndPage: true
    }
    tabRef.value?.setPageData(tabIndex, tabPage)
    this.tabPageIndex = tabIndex
    tabRef.value?.setPageState(tabIndex, QTTabPageState.QT_TAB_PAGE_STATE_COMPLETE)
    userManager.addUserChangeListener(userChangeListener)
    this.tabRef = tabRef
    this.isShow = true
  }
  clear(){
    userManager.removeUserChangeListener(userChangeListener)
    this.isShow = false
  }
  logout(){
    userManager.clearUserInfo()
  }
  routerLaunch(item:any, _launch?:any){
    const rlaunch = _launch||launch
    this.lastRouter = item._router?.url||''
    this.triggerRouterId = item.id||item._id
    if(item._router?.isNoCheckLogin){
      rlaunch.launch(item)
    } else {
      if(userManager.isLogin()){
        if(item._router?.isVipRouter){
          rlaunch.jumpVipPay()
        } else {
          rlaunch.launch(item)
        }
      } else {
        rlaunch.jumpLogin()
      }
    }
  }
  checkRouter(){
    // console.log(this.lastRouter, '--lsj-this.lastRouter')
  }
}
const myDataManager = new MyDataManager()
const userChangeListener:UserChangeListener = {
  onUserChanged(user, state){
    myDataManager.isUserChange = true
    myDataManager.updateData()
  }
}
// if(pageIndex === myDataManager.tabPageIndex){
//   myDataManager.setData(tabRef, tabContentTop)
// }
export default myDataManager
