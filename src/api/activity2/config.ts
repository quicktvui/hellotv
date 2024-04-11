import { IActivityConfig, topModes } from './types'

export const config: IActivityConfig = {
  bgColor: {colors:['#2F3541','#252930'],cornerRadius:0},
  bgImg: 'https://up.deskcity.org/pic_source/28/73/cd/2873cd9dc91fa720a498b043aebd4509.jpg',
  top: {
    mode: topModes.lr,
    title: '海底冒险小剧场季卡',//海底冒险小剧场季卡
    titleStyle: {
      color: '#ffffff', fontSize: '50px'
    },
    btnListWidth: 330
  },
  banner: {
    // img: 'https://up.deskcity.org/pic_source/28/73/cd/2873cd9dc91fa720a498b043aebd4509.jpg',
    style: { height: '600px' }
  }
}