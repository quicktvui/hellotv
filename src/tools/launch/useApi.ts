import {inject, InjectionKey} from 'vue'
import {Launch} from "./Launch";

export const LaunchKey = Symbol('LaunchKey') as InjectionKey<Launch>

export function useLaunch(): Launch {
    return inject(LaunchKey)!
}
