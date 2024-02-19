import {RequestBaseParams} from "./RequestBaseParams";

export interface RequestDeviceParams extends RequestBaseParams{
    brand: string
    clientType: string
    dnum: string
    mac: string
    esMac: string
    esWifiMac: string
    manufacturer: string
    model: string
    deviceVersion: string
}
