import {RequestBaseParams} from "./RequestBaseParams";

export interface RequestDevelopParams extends RequestBaseParams{
    packagename: string
    vercode: number
    vername: string
    dynamicCode: number
}
