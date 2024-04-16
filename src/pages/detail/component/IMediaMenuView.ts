import { IMedia } from "../../../api/media/IMedia"

export interface IMediaMenuView {
  initMedia(media: IMedia): void

  setAutofocus(enable: boolean): void

  requestFullButtonFocus(): void

  release(): void
}
