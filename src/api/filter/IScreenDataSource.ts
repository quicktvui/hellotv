export interface IScreenDataSource {
  getScreenLeftExpand(): Promise<any>;

  getScreenLeftTags(screenId: string): Promise<any>;

  getScreenContentByTags(tags, pageNum): Promise<any>;
}
