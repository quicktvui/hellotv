import { LaunchParams } from '../../../../tools/launch'

/**
 * 导航类型
 */
export enum BarType{
  //文本类型
  TYPE_TEXT = 1,
  //图片类型
  TYPE_IMG = 2
}

/**
 * 导航
 */
export interface TabBarItem {
  //导航ID
  id:string
  //导航类型1：文本，2：图片
  type:BarType
  //导航名称
  name:string
  //导航背景图
  backgroundImg?:string
  //默认选中导航
  isDefault?:boolean
  //图片类型导航数据
  image?:{
    //默认图
    normal:string
    //选中图
    selected:string
    //焦点图
    focused:string
    //图片尺寸
    style:{
      width:string
      height:string
    }
  }
  //文本导航角标
  corner?:{
    //默认图
    normal:string
    //选中图
    selected:string
    //焦点图
    focused:string
  }
  //跳转参数
  jumpParams?:LaunchParams
  [props:string]:any
}
