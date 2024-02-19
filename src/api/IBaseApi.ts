import {ESApp} from "@extscreen/es3-vue";

export interface IBaseApi{
  install(app: ESApp): void

  init(...params: any[]): Promise<any>
}
