export interface IScreenDataSource {
    getScreenLeftTags(screenId: string): Promise<any>

    getScreenContentByTags(pageNum: number, tags: string): Promise<any>
}
