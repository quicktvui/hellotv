import {RequestBaseParams} from "./RequestBaseParams";

export interface RequestRuntimeParams extends RequestBaseParams{
    sdkVersion: number
    sdkCID: string
    runtimeID: string,
    hostPackageName: string
    hostVersion: number
    hostChannel: string
    snCode: string
}
