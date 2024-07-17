type Tvalues<T> = T[ keyof T ]
export const topModes = {
  rightLogo: 'rightLogo',
  leftLogo: 'leftLogo'
} as const;

export type TtopModes = Tvalues<typeof topModes>;

export interface ITopMenuBarBtns {
  id:number|string; text:string; lIcon?:any, rIcon?: any;
  lIconf?:any, rIconf?: any;
}

export interface ItopMenuBarLogo {
  title?: string; titleIcon?:any; img?:any;
}

export interface ITopMenuBarConfig {
  topMode?: TtopModes;
  logo?: ItopMenuBarLogo;
  btns: Array<ITopMenuBarBtns>
}