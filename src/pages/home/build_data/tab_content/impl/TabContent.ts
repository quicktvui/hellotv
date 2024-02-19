//
import {TabContentSection} from "./TabContentSection";

export interface TabContent {
    id: string
    firstPlateMarginTop: number
    disableScrollOnFirstScreen: boolean
    plates: Array<TabContentSection>
    plateCount?: number
    [prop:string]:any
}
