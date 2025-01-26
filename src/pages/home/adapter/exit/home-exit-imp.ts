import { LaunchParams } from '../../../../tools/launch'

export interface TopResource{
  url:string
  //跳转参数
  jumpParams?:LaunchParams
}

export interface ExitListItem{
  title:string
  cover:string
  jumpParams:LaunchParams
}
