

export interface IScreenDataSource{
  getScreenLeftTags(screenId:string):Promise<any>

  getScreenContentByTags(tags,pageNum):Promise<any>
}
