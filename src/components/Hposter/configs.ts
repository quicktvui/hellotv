
const focusBorderTypes = {
  none: 'none',//不现实焦点边框
  poster: 'poster',//按整个格子大小绘制边框，将标题包裹在边框内
  img: 'img',//按图片大小绘制边框
} as const;
type Tvalues<T> = T[ keyof T ]

interface IposterData {
  id:string;

  poster:string;//预览图
  imgWidth?:number;
  imgHeight?:number;

  title?:string;//标题
  titleSpace?:{left:number;top:number;right:number;bottom:number}//标题距离上下左右的间隙
  titleLines?:number;//标题最大行数
  subTitle?:string;//副标题
  
  corner?:string;//角标
  imgCorner?:string;//图片角标

  focusBorderType?: Tvalues<typeof focusBorderTypes>;//指定获取焦点时的边框类型
  [k:string]:any
}

const dPosterImgWidth = 307
const dPosterImgHeight = 175
const dPosterTitleSize = 24
const dPosterSubTitleSize = 18
const dTitleLines = 1
const dFocusBorderType = focusBorderTypes.img
const dTitleSpace = {left:8,top: 8,right:10,bottom:5,dSpace:8}

export const hPosterType = 20001
export const getPosterConfig = (data:IposterData) => {
  const imgWidth = data.imgWidth||dPosterImgWidth
  const imgHeight = data.imgHeight||dPosterImgHeight

  const titleSpace = { ...dTitleSpace,...(data.titleSpace||{}) }
  if(!data.title){
    titleSpace.top = 0
    titleSpace.bottom = 0
  }
  const titleLines = data.titleLines||dTitleLines
  const titleSize = dPosterTitleSize
  const subTitleSize = dPosterSubTitleSize
  const titleW = imgWidth
  const titleH = data.title ? titleSize*titleLines + titleSpace.dSpace : 0
  const subTitleW = imgWidth
  const subTitleH = data.subTitle ? subTitleSize + titleSpace.dSpace : 0
  const titleStyle = {
    width: imgWidth, height: titleH + subTitleH + titleSpace.top + titleSpace.bottom,
    marginTop: imgHeight,
  }

  const posterWidth = imgWidth
  const posterHeight = imgHeight + titleStyle.height

  const focusBorderType = data.focusBorderType||dFocusBorderType
  const coverStyle:any = {}
  if(focusBorderType===focusBorderTypes.poster){
    coverStyle.width = posterWidth
    coverStyle.height = posterHeight
  }
  if(focusBorderType===focusBorderTypes.img){
    coverStyle.width = imgWidth
    coverStyle.height = imgHeight
  }
  return {
    _id: data.id, type: hPosterType, coverStyle,
    focus: { enable: true, scale: 1.1, border: true },
    decoration: {
      left: 0, top: 0, right: 48, bottom: 0
    },
    style: {
      width: posterWidth, height: posterHeight,
    },
    image: {
      src: data.poster, enable: true,
      style: {
        width: imgWidth, height: imgHeight
      }
    },
    title: {
      text: data.title,
      enable: !!data.title,
      style: {
        width: titleW, height: titleH,
        marginBottom: titleSpace.bottom,marginTop: titleSpace.top,
        fontSize: titleSize
      },
      lines: titleLines, ellipsizeMode: titleLines===1?4:2,
      paddingRect: [titleSpace.left,0,titleSpace.right,0],
      color: '#BFBFBF', focusColor: '#BFBFBF'
    },
    subTitle: {
      text: data.subTitle,
      enable: !!data.subTitle,
      style: {
        width: subTitleW, height: subTitleH,
        fontSize: subTitleSize
      },
      paddingRect: [titleSpace.left,0,titleSpace.right,0],
      color: '#959292', focusColor: '#959292'
    },
    floatTitle: {
      text: '',
      enable: false,
      style: {},
      paddingRect: [titleSpace.left,0,titleSpace.right,0]
    },
    shimmer: {
      enable: false, size: 0
    },
    ripple: {
      enable: false,
      style: {}
    },
    corner: {
      text: '',
      enable: false,
      style: {},
      background: {}
    },
    titleStyle,
    titleFocusStyle: {
      width: imgWidth, height: titleH + subTitleH,
      marginTop: imgHeight,
    }
  }
}