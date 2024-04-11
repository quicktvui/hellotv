// @ts-ignore
import { IacTivity2GetFlexBlockRes, getActivity2FlexBlock } from "../../pages/activity2/index.ts";
import { Activity2BaseApi } from "./base";
import { IActivityTopItemBtn } from "./types.js";

class Activity2Api extends Activity2BaseApi {
  // async getTopBtns(): Promise<IActivityTopItemBtn[]> {
  //     return []
  // }
  // async getList(): Promise<IacTivity2GetFlexBlockRes[]> {
  //     return []
  // }
}
const activity2Api = new Activity2Api()
export default activity2Api