import {RequestBaseParams} from "./RequestBaseParams";

export interface RequestUserParams extends RequestBaseParams{
    userId: string
    userToken: string
    nickname: string
}
