import { IMediaUrl } from "../../../api/media/IMediaUrl"

export interface ESDefMediaList{
  id:string
  title?:string,
  subTitle?:string
  cover?:string
  url?:Array<IMediaUrl>
  isRequestUrl?:boolean
}


