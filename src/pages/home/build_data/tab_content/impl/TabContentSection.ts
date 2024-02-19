//
import {TabSectionItem} from "./TabSectionItem";

export interface TabContentSection {
    id: string
    plateName: string
    showPlateName: string
    plateType: string
    plateDetails: Array<TabSectionItem>
    height: number
    isSwitchCellBg:string
    timeAxisSwitch: string
    isFocusScrollTarget?:boolean
}
