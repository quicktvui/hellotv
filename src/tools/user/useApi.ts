import {inject, InjectionKey} from 'vue'
import {UserManager} from "./UserManager";

export const UserManagerKey = Symbol('UserManagerKey') as InjectionKey<UserManager>

export function useUserManager(): UserManager {
    return inject(UserManagerKey)!
}
