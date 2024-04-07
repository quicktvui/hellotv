import { IActivityConfig, topModes } from '../../api/activity2/types'
import { config } from '../../api/activity2/config'

export const getBgColor = (bColor?:string|object)=>{
  if(!bColor) return false
  return (typeof bColor === 'string') ? {colors:[bColor,bColor],cornerRadius:0} : bColor
}
export const dConfig = {
  bgColor: getBgColor(config.bgColor) || {colors:['#2F3541','#252930'],cornerRadius:0},
  bgImg: config.bgImg || 'https://img1.baidu.com/it/u=2666955302,2339578501&fm=253',
  top: {
    mode: 'left-right',
    title: '海底冒险小剧场季卡',
    titleColor: '',
    titleSize: 20,
    btnListWidth: 300,
    btnStyle: {
      color: '#fff'
    },
    btnFocusedStyle: {
      color: '#000'
    }
  }
}