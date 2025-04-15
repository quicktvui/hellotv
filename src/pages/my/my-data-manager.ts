import { QTPoster, QTWaterfallSection, QTWaterfallSectionType, QTITab, QTTabPageData, QTTabPageState } from '@quicktvui/quicktvui3'
import { Ref } from 'vue'
import myApi from '../../api/my'
import userManager from '../../api/user/user-manager'
import launch, { LaunchParams } from '../../tools/launch'
import BuildConfig from '../../config/build-config'
import { UserChangeListener, UserInfo } from '../../api/user/impl-user'
import ic_record_normal from '../../assets/my/ic_record_normal.png'
import ic_record_focus from '../../assets/my/ic_record_focus.png'
import { ICollect } from '../detail/adapter/interface'
export const activity_redirectTypes = {
  innerRouter: 1, //跳转到当前app内部页面
  innerApp: 0, //跳转到内部其他app
  test: -1
}

const dcornerGradientBg = { colors: ['#FFE398', '#EEB364'], cornerRadii4: [0, 9, 0, 9], orientation: 2 }

export const posterTypes = {
  poster: 101,
  iconTitleRow: 102,
  info: 103,
  user: 104,
  iconTitleCol: 105,
  card2: 106
}
export interface IBlockItemData {
  id: string
  img?: string //图片
  title?: string //标题
  subTitle?: string //副标题，有副标题时取副标题，无副标题时取播放进度 playCount+currentPlayTime/allTime
  floatTitle?: string //浮动标题
  corner?: string //角标
  cornerGradientBg?: typeof dcornerGradientBg //角标背景色
  score?: string //评分
  cornerNum?: number

  currentPlayTime?: number //当前播放时间-毫秒
  allTime?: number //视频总时间-毫秒
  playCount?: string //播放到第几集
  playTime?: string //播放时间(时间戳或2024-03-28 20:43:42格式字符串)

  gradientBb?: typeof dcornerGradientBg //背景色-渐变色
  //跳转数据
  jumpParams: LaunchParams
  _action?: string // 内部其他app地址
  _redirectType?: number | string //跳转类型，取值见activity_redirectTypes
  _layout?: { x?: number; y?: number; width?: number; height?: number }
  [k: string]: any
}
interface Ioptions {
  //Partial
  posterWidth?: number
  posterHeight?: number
  imgWidth?: number
  imgHeight?: number
  posterBottom?: number
  space?: number
  posterType?: number
  posterTitleHeight?: number
  posterSubTitleHeight?: number
  titleFontSize?: number
  subTitleFontSize?: number
  iconWidth?: number
  iconHeight?: number
}
interface IblockOptions {
  blockTitleFontSize?: number
  blockTitleTop?: number
  columns?: number
  space?: number
  posterBottom?: number
  posterType?: number
  [k: string]: any
}
interface IBlockData {
  id: string
  title?: string
  list: IBlockItemData[]
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
const dSpace = 36 //36
const dBlockTitleFontSize = 40
const dPadding = 0
const dColumns = 4
const dIconWidth = 80
const dIconHeight = 80
const dPosterType = posterTypes.poster
export const dPageWidth = 1920
export const dPageheight = 1080
export const dPageMarginSpace = 80 // 页面两端间距
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
    console.error(error)
  }
  return subTitle
}
export const getPosterConfig = (data: IBlockItemData, options: IblockOptions = {}): QTPoster => {
  const itemPadding = options.itemPadding || dPadding
  const space = options.space == undefined ? dSpace : options.space
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
  const titleFontColor = data._titleFontColor
  const titleFontSize = data._titleFontSize || dTitleFontSize * ratio
  const subTitleFontSize = data._subTitleFontSize || dSubTitleFontSize * ratio
  const posterTitleHeight = titleFontSize + 20
  const posterSubTitleHeight = subTitleFontSize + 6
  const iconWidth = dIconWidth * ratio
  const iconHeight = dIconHeight * ratio
  const posterType = options.posterType || data.posterType || dPosterType || posterTypes.poster
  if (posterType === posterTypes.poster) {
    //||posterType==posterTypes.info
    if (data.title) {
      posterHeight += posterTitleHeight
    }
    if (subTitle) {
      posterHeight += posterSubTitleHeight
    }
    posterHeight += titleTop
  }

  const titleboxHeight = (data.title ? posterTitleHeight : 0) + (subTitle ? posterSubTitleHeight : 0)
  const cornerNum = data.cornerNum && data.cornerNum > 0 ? (data.cornerNum > 99 ? 99 + '+' : data.cornerNum + '') : '0'
  return {
    _id: data._sectionItemId || data.id,
    jumpParams: data.jumpParams,
    _action: data._action,
    tip: data.tip,
    focusedImageSrc: data.focusedImage || data.img,
    focusedBgColor: data.focusedBgColor,
    bgColor: data._bgColor,
    showMoreImg: !!(data.clist && data.clist.length),
    moreImg: data.clist?.[0]?.assetLongCoverH,
    moreImg2: data.clist?.[1]?.assetLongCoverH,
    item: {
      redirectType: data._redirectType || activity_redirectTypes.innerRouter,
      innerArgs: data._router ? JSON.stringify(data._router) : ''
    },
    _redirectType: data._redirectType || activity_redirectTypes.innerRouter,
    cornerNum,
    _isShowCornerNum: cornerNum !== '0',
    _isCornerNum: data.cornerNum ? true : false,
    focus: { enable: true, scale: 1, border: false },
    type: posterType, //10001
    editMode: false,
    decoration: {
      left: 0,
      right: space,
      bottom: options?.posterBottom || dPosterBottom
    },
    style: {
      width: posterWidth,
      height: posterHeight
    },
    imageBgStyle: {
      width: imgWidth + itemPadding * 2,
      height: imgHeight + itemPadding * 2,
      marginTop: -itemPadding,
      marginLeft: -itemPadding
    },
    image: {
      src: data.img,
      enable: !!data.img,
      style: {
        width: imgWidth,
        height: imgHeight
      }
    },
    corner: {
      text: data.corner || '',
      enable: !!data.corner,
      style: {
        width: imgWidth
      },
      background: data.cornerGradientBg || dcornerGradientBg
    },
    score: {
      text: data.score || '',
      enable: !!data.score,
      style: {
        width: imgWidth,
        height: 30
      }
    },
    title: {
      text: data.title || '',
      enable: !!data.title,
      style: {
        width: imgWidth,
        height: data.title ? posterTitleHeight : 0,
        fontSize: titleFontSize
      }
    },
    titleFontColor,
    focusTitle: {
      text: data._focusTitle || data.title || '',
      enable: !!(data._focusTitle || data.title)
    },
    titleBoxStyle: {
      width: posterWidth,
      height: titleboxHeight,
      marginTop: imgHeight + titleTop
    },
    titleFocuseBoxStyle: {
      width: posterWidth,
      height: titleboxHeight,
      marginTop: imgHeight - 16,
      paddingTop: 5
    },
    bgStyle: {
      width: posterWidth, // + itemPadding*2,
      height: posterHeight - 20 // + itemPadding,
      // marginTop: -(itemPadding+1), marginLeft: -(itemPadding+1),
    },
    coverStyle: {
      width: posterWidth,
      height: posterHeight - 20
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
      }
    },
    floatTitle: {
      text: data.floatTitle || '',
      enable: !!data.floatTitle,
      style: {
        width: imgWidth
      }
    },
    infoStyle: {
      width: imgWidth * (data._infoWidthRatio || 0.6)
    },
    icon: {
      style: {
        width: data._iconWidth || iconWidth,
        height: data._iconHeight || iconHeight
      }
    }
  }
}
export interface ImySectionRes {
  section: QTWaterfallSection
  options?: IblockOptions
  sectionHeight: number
}
export interface VipInfo {
  isVip: boolean
  endTime: string
  payLimit?: number
  endDateTime: string
}
export const getMysection = (
  data: IBlockData,
  sectionType: number = QTWaterfallSectionType.QT_WATERFALL_SECTION_TYPE_FLEX
): ImySectionRes => {
  const space = data.options?.space == undefined ? dSpace : data.options.space
  const contentWidth = dPageWidth - dPageMarginSpace - (dPageMarginSpace - space)
  const sectionHeight = 0
  const itemList = data.list.map((item, index) => {
    const posterData = getPosterConfig({ ...item, _sectionItemId: data.id + item.id + index }, data.options)
    // sectionHeight += (posterData.style.height||0)+(posterData.decoration?.bottom||0)
    // console.log('posterData:'+JSON.stringify(posterData))
    return posterData
  })
  const blockTitleFontSize = data.options?.blockTitleFontSize || dBlockTitleFontSize
  const section: QTWaterfallSection = {
    _id: data.id,
    type: sectionType, //QT_WATERFALL_SECTION_TYPE_FLEX
    title: data.title || '',
    titleStyle: {
      marginTop: data.options?.blockTitleTop || 0,
      marginBottom: data.title ? data.options?.blockTitleBottom || 20 : 0,
      fontSize: blockTitleFontSize,
      height: data.title ? blockTitleFontSize : 0,
      width: 1000,
      marginLeft: 0
    },
    //3.构造section中item列表数据
    itemList,
    style: {
      width: contentWidth,
      height: -1
    },
    decoration: {
      left: dPageMarginSpace,
      // right: dPageMarginSpace-space,
      top: data.options?.sDecorationTop ?? 0,
      bottom: data.options?.sDecorationBottom ?? 0
    },
    isSwitchCellBg: '0'
  }
  return {
    section,
    options: data.options,
    sectionHeight: sectionHeight //+(section.decoration?.bottom||0)+(section.titleStyle?.height||0)+(section.titleStyle?.marginBottom||0)
  }
}

export const transHistorySection = (historyRes: ImySectionRes, userInfo: UserInfo | null | undefined) => {
  const isEmpty = historyRes.section.itemList.length === 0
  //如果无记录，则显示的是无记录的格子
  const poster = getPosterConfig(
    {
      id: '2getHistoryMore',
      img: 'file://' + ic_record_normal,
      focusedImage: 'file://' + ic_record_focus,
      title: isEmpty ? '您还没有观看历史哦～' : '全部记录',
      _titleFontSize: 36,
      _titleFontColor: isEmpty ? 'rgba(255,255,255,0.55)' : '#FFFFFF',
      tip: '',
      subTitle: '',
      _layout: { width: isEmpty ? 1760 : 410, height: 230 },
      jumpParams: { type: 1, options: { name: 'history', params: { menuIndex: 0 } } },
      _iconWidth: 80,
      _iconHeight: 80
    },
    {
      posterType: !userInfo ? posterTypes.iconTitleCol : posterTypes.iconTitleRow,
      space: historyRes.options?.space
    }
  )
  historyRes.section.itemList.push(poster)
  return historyRes.section
}
export const transMoreSectin = (sections: ImySectionRes[]) => {
  return sections.map((item) => {
    return item.section
  })
}

const userConfig = {
  btn: '立即登录',
  nickName: '登录同步云端记录',
  tip: '',
  router: { type: 0, options: '' },
  loginBtn: '账号管理',
  loginTip: ''
}

export const updateUserInfoItem = (userinfo, newInfo?: UserInfo | null) => {
  userinfo.image.src = ''
  userinfo.image.enable = false
  userinfo.title.text = userConfig.nickName
  userinfo.subTitle.text = userConfig.btn
  userinfo.jumpParams = userConfig.router
  userinfo.tip = userConfig.tip
  console.log('newInfo:' + JSON.stringify(newInfo))
  return userinfo
}
//第一行板块
export const transCenterSection = (vipInfo: VipInfo, info: UserInfo | null) => {
  //获取第一行板块数据
  const sectionRes = myApi.getCenterInfo(vipInfo, info)
  //更新其中格子的跳转
  sectionRes.section.itemList.unshift(
    getPosterConfig(
      {
        id: (sectionRes.section._id || 'my_userinfo') + sectionRes.section.itemList.length,
        img: info ? info?.headImage : '',
        title: info ? info?.nickname : userConfig.nickName,
        tip: info ? userConfig.loginTip : userConfig.tip,
        subTitle: info ? userConfig.loginBtn : userConfig.btn,
        _layout: { width: 557, height: 314 },
        jumpParams: userConfig.router
      },
      {
        posterType: posterTypes.user,
        space: sectionRes.options?.space
      }
    )
  )
  // console.log('centerSection:'+JSON.stringify(sectionRes))
  return sectionRes.section
}

class MyDataManager {
  tabPageIndex = -1
  isUserChange = false
  isShow = false
  tabRef?: Ref<QTITab | undefined>
  lastRouter: string = ''
  triggerRouterId = ''
  agreementConfig = {
    //协议配置
    agreementUrlList: []
  }
  lastHistoryData: ICollect | null = null //上次上报的历史记录，用于解决服务器刷新不及时问题
  constructor() {}

  async getData(): Promise<QTWaterfallSection[]> {
    //获取会员信息
    const vipInfo = await myApi.getVipInfo()
    const historyRes = await myApi.getHistorys()
    //获取协议配置
    const moreRes = await myApi.getMoreList([
      {
        code: 'user',
        name: '用户协议',
        url: 'https://api.extscreen.com/extscreenapi/api/v3/zero/user/agreement/index?name=es.tv.huan.hellotv&default=user'
      },
      {
        code: 'privacy',
        name: '隐私政策',
        url: 'https://api.extscreen.com/extscreenapi/api/v3/zero/user/agreement/index?name=es.tv.huan.hellotv&default=privacy'
      },
      {
        code: 'child',
        name: '儿童保护协议',
        url: 'https://api.extscreen.com/extscreenapi/api/v3/zero/user/agreement/index?name=es.tv.huan.hellotv&default=child'
      },
      {
        code: 'sdk',
        name: '三方SDK清单',
        url: 'https://api.extscreen.com/extscreenapi/api/v3/zero/user/agreement/index?name=es.tv.huan.hellotv&default=sdk'
      },
      {
        code: 'share',
        name: '三方信息共享',
        url: 'https://api.extscreen.com/extscreenapi/api/v3/zero/user/agreement/index?name=es.tv.huan.hellotv&default=share'
      }
    ])
    const info = userManager.getUserInfo()
    //获取卡片列表
    const res = [transCenterSection(vipInfo, info), transHistorySection(historyRes, info)]
    return res.concat(transMoreSectin(moreRes))
  }
  async updateUser() {
    if (this.tabRef) {
      const userinfo = this.tabRef.value?.getPageItem(this.tabPageIndex, 0, 0)
      const newInfo = userManager.getUserInfo()
      if (userinfo?._id) {
        updateUserInfoItem(userinfo, newInfo)
      }
    }
  }
  async updateHistory(userInfo: UserInfo | null) {
    if (this.tabRef) {
      const historyRes = await myApi.getHistorys()
      const hisSection = transHistorySection(historyRes, userInfo)
      this.tabRef.value?.updatePageSection(this.tabPageIndex, 1, hisSection)
      if (this.triggerRouterId && this.lastRouter == 'history') {
        this.lastRouter = ''
        this.tabRef?.value?.setAutoFocus(this.triggerRouterId, 0)
      }
    }
  }
  async updateData(userInfo: UserInfo | null) {
    if (this.tabPageIndex >= 0 && this.tabRef && this.isShow) {
      const cIndex = await this.tabRef.value?.getCurrentTabIndex()
      if (cIndex === this.tabPageIndex) {
        if (this.isUserChange) {
          this.isUserChange = false
          this.checkRouter()
          this.updateUser()
        }
        this.updateHistory(userInfo)
      }
    }
  }
  async setData(tabRef: Ref<QTITab | undefined>, tabIndex, tabContentTop = 0) {
    const tData = await this.getData()
    tData[0].decoration!.top = tabContentTop
    tData[tData.length - 1].decoration!.bottom = 20
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
  clear() {
    userManager.removeUserChangeListener(userChangeListener)
    this.isShow = false
  }
  logout() {
    userManager.clearUserInfo()
  }
  routerLaunch(item: any) {
    console.log('router:' + JSON.stringify(item.jumpParams))
    if (!item.jumpParams) return
    this.lastRouter = item._router?.url || ''
    this.triggerRouterId = item.id || item._id
    launch.launch(item.jumpParams)
  }
  checkRouter() {
    // console.log(this.lastRouter, '--lsj-this.lastRouter')
  }
}
const myDataManager = new MyDataManager()
export const myDataManager2 = new MyDataManager()
const userChangeListener: UserChangeListener = {
  onUserChanged(user) {
    myDataManager.isUserChange = true
    myDataManager.updateData(user)
    myDataManager2.isUserChange = true
    myDataManager2.updateData(user)
  }
}
// if(pageIndex === myDataManager.tabPageIndex){
//   myDataManager.setData(tabRef, tabContentTop)
// }
export default myDataManager
