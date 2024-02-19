import {IMedia} from "../../../../api/media/IMedia";
import {QTICollapseItem} from "@quicktvui/quicktvui3";

export interface IMediaCollapseMediaSeriesView extends QTICollapseItem {

  initMedia(media: IMedia): void

  setListData(page: number, mediaList: Array<IMedia>): void

  setItemFocused(position: number): void

  setItemSelected(position: number): void

  show(value: boolean)
}
