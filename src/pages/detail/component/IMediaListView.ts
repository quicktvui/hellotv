import {IMedia} from "../../../api/media/IMedia";


export interface IMediaListView {
  initMedia(media: IMedia)

  scrollTo(position: number): void;

  setSelected(position: number): void;

  release(): void
}
