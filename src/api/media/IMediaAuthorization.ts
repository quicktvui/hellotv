//
import {IMediaAuthType} from "./IMediaAuthType";

export interface IMediaAuthorization {
  id: string//媒资id
  auth: boolean//是否鉴权成功
  payType?: string//付费类型
  type: IMediaAuthType//权益类型
  typeName?: string//权益名称

  [prop: string]: any
}
