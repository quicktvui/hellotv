// @ts-ignore
import { IacTivity2GetFlexBlockRes, getActivity2FlexBlock } from "../../pages/activity2/index.ts";
import { Activity2BaseApi, IAnyobj } from "./base";
import { IActivityConfig, IActivityTopItemBtn } from "./types";

class Activity2Api extends Activity2BaseApi {
  // async initPageData(routerParams: IAnyobj): Promise<any> {
  //     return {}
  // }
  // async getConfigs(): Promise<IActivityConfig> {
  //     return {}
  // }
  // async getTopBtns(): Promise<IActivityTopItemBtn[]> {
  //     return []
  // }
  // async getList(): Promise<IacTivity2GetFlexBlockRes[]> {
  //     return []
  // }
}
const activity2Api = new Activity2Api()
export default activity2Api