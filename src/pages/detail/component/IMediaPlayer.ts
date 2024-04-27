import {IMedia} from "../../../api/media/IMedia";
import {ESKeyEvent} from "@extscreen/es3-core";
import {ESPlayerWindowType} from "@extscreen/es3-player";
import { QTIBaseView } from '@quicktvui/quicktvui3/dist/src/base/QTIBaseView'

export interface IMediaPlayer extends QTIBaseView{

  play(media: IMedia)

  addMediaItemList(page: number, mediaList: Array<IMedia>)

  playMediaItemById(id: string)

  playMediaItemByIndex(index: number)

  getPlayingMediaIndex(): number

  setFloatWindow()

  setSmallWindow()

  getWindowType(): ESPlayerWindowType

  stop()

  release()

  resume()

  reset()

  setFullWindow(): void

  onKeyDown(keyEvent: ESKeyEvent): boolean

  onKeyUp(keyEvent: ESKeyEvent): boolean

  onBackPressed(): boolean

  changeVisible(value: boolean): void
}
