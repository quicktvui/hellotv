type Tvalues<T> = T[ keyof T ]

export const topModes = {
  lr: 'left-right',
  rl: 'right-left'
} as const;

export interface IActivityConfig {
  bgColor?:string|object
  bgImg?:string
  top?: {
    mode?: Tvalues<typeof topModes>
    title?: string
    titleColor?:string
    titleSize?:number
    btnTxt?:string
    btnIcon?:string
    btnFocusedIcon?:string
    btnTxtColor?:string
    btnTxtBg?:string
    btnTxtFocusedBg?:string
    btnTxtFocusedColor?:string
  }
}

export interface IActivityBlockPosterLayout {
  width:number
  height:number
  paddingRect:number[]
}
export interface IActivityBlockText {
  txt: string
  fontSize:number
  color:string
  focusedColor:string
  bgColor:object|string
  focusedBg:object|string
  layout: IActivityBlockPosterLayout
}
export interface IActivityBlockItem {
  img:string
  title: IActivityBlockText
  tag: IActivityBlockText
}
export interface IActivityBlock {
  offsetT?:number
  titleTxt?:string
  titleImg?:string
  itemWidth?:number
  itemHeight?:number
  column?:number//列宽
  columnSpace?:number//列间距
  list: IActivityBlockItem[]
}

export interface IActivityTopBtnConfig { 
  type?: number; //1 带图标，2不带图标 默认2
  text: string;
  background?: string[]; 
  focusedBackground?: string[];
  icon?: any;
  focusIcon?: any;
  textColor?: string;
  textFocusColor?: string
}
export interface IActivityTopItemBtn {
  type: number;
  decoration: { left: number; };
  text: string;
  background: {
      colors: string[];
      cornerRadius: number;
  };
  focusedBackground: {
      colors: string[];
      cornerRadius: number;
  };
  icon: any;
  focusIcon: any;
  textColor: string;
  textFocusColor: string;
}