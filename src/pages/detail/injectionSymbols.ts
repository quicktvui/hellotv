import type {InjectionKey, Ref} from 'vue'
import {IMediaAuthorization} from "../../api/media/IMediaAuthorization";

export const mediaAuthorizationKey = Symbol(
  'MediaAuthorizationKey'
) as InjectionKey<Ref<IMediaAuthorization | undefined>>
