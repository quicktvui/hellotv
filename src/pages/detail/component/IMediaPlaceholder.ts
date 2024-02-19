import {IMedia} from "../../../api/media/IMedia";

export interface IMediaPlaceholder {
  initMedia(media: IMedia): void

  showMediaInfo(show: boolean): void

  show(value: boolean): void

  requestFocus(): void
}
