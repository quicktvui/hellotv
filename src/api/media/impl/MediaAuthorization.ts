//
export interface MediaAuthorization {
  assetLongId: string//媒资id
  auth: boolean//是否鉴权成功
  payType: string//付费类型
  typeCode: string//权益类型
  typeName: string//权益名称
  endTime: string
  categoryName: string

  [prop: string]: any
}
