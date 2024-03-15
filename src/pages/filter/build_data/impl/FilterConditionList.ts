import {FilterCondition} from "./FilterCondition";

export type FilterConditionList = {
  defaultSelectPosition?:number
  list?:Array<FilterCondition>
  [prop:string]:any
}
