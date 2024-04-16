import {IMedia} from "../../../api/media/IMedia";

export interface IAlbumDetail {

  initMedia(media: IMedia)

  showPlaceholderMediaInfo(value: boolean)

  show(value: boolean)

  scrollMediaListViewTo(position: number): void

  setMediaListViewSelected(position: number): void

  requestPlayerPlaceholderFocus(): void

  requestFullButtonFocus(): void

  release(): void

  setAutofocus(value:boolean): void
}
