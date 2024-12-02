import { LaunchParams } from '../../../../tools/launch'

export interface NavBar{
  id:string
  type:string
  name:string
  backgroundImg?:string
  isDefault?:boolean
  image?:{
    normal:string
    selected:string
    focused:string
    style:{
      width:string
      height:string
    }
  }
  corner?:{
    normal:string
    selected:string
    focused:string
  }
  jumpParams?:LaunchParams
  [props:string]:any
}
