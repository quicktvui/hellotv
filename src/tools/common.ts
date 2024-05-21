export let isLowEndDev:boolean = true
export function setIsLowEndDev(isLDev: boolean) { // App.vue  判断是否为低端机型
    isLowEndDev = isLDev
}