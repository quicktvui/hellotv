export interface FilterApi {
  // 获取筛选列表
  getFilterList(): Promise<any>
  // 获取筛选内容
  getFilterContents(): Promise<any>
}
