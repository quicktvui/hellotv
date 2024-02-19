//
import {QTFlexStyleSize} from "@quicktvui/quicktvui3/dist/src/core/QTFlexStyleSize";

export interface TabContentPlate {
    id: string
    plateName?: string
    plateImgTitle:string
    plateImgStyle?:QTFlexStyleSize
    plateHeight: number
    sectionList?:Array<any>
    showPlateName: boolean
    showImgPlateName:boolean
    plateType: string
    tabContentPlate?:boolean
    isSwitchCellBg?:string
    [prop: string]: any;
}
