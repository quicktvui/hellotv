// @ts-ignore
import { IacTivity2GetFlexBlockRes, getFlexBlock } from "../../pages/activity2/index.ts";
import { Activity2BaseApi } from "./base";

class Activity2Api extends Activity2BaseApi {
  // async getList(): Promise<IacTivity2GetFlexBlockRes[]> {
  //     return []
  // }
}
const activity2Api = new Activity2Api()
export default activity2Api