import fullIcon from '../../assets/ic_media_full_button_normal.png'
import fullIconf from '../../assets/ic_media_full_button_focused.png'
import vipIconf from '../../assets/my/vip_f.png'
// import logo2 from '../../assets/ic_seekbar.png'

import { IvideoDes } from './types'
import { tUid } from '../../tools/common'

// 测试视频播放地址数据
export const videos = [
  "http://qcloudcdn.a311.ottcn.com/channelzero/2024/02/05/d477660a-3eb6-4c7f-b82b-0b61c035505c.mp4",
  "http://qcloudcdn.a311.ottcn.com/channelzero/2024/02/05/110e7a35-1ba3-4d87-a8ea-0f462de40866.mp4",
  "http://qcloudcdn.a311.ottcn.com/channelzero/2024/02/05/5fc2d6dd-0566-4c70-a4ba-be6e47e39252.mp4",
  "http://qcloudcdn.a311.ottcn.com/channelzero/2024/02/05/a87f2fd0-579c-4d4e-9bb7-4183f6bd3604.mp4"
]

export const getDefaultVideoData = (title:string):IvideoDes => {
  return {
    title: title, id: tUid.cleateId(),
    des: `${title};${title};${title};${title};${title};${title};${title};${title};`,
    tags: [
      { id: 1, txt: '8.1分', gap: 10, color: 'red' },
      { id: 2, txt: '剧情', mode: 'tag', gap: 10, color: 'orangered', bgColor:'rgba(228, 120, 19, 0.1)', borderColor:'rgba(236, 11, 11, 0.1)' },
      { id: 3, txt: '动作', showSplit:true },
      { id: 4, txt: '悬疑', showSplit:true },
      { id: 5, txt: '冒险', gap: 20 },
      { id: 6, txt: '会员专享', mode: 'btn' },
    ],
    actions: [
      { id: 1, txt: '全屏观看', type: 1, action: '1', icon: fullIcon, iconf: fullIconf },
      { id: 2, txt: '视频详情', type: 1, action: '2', icon: fullIcon, iconf: fullIconf, gradientBg:{colors:['#00C7FF','#0057FF'], cornerRadii4: [9, 9, 9, 9],orientation:6},gradientBgf:{colors:['#FFE398','#EEB364'], cornerRadii4: [9, 9, 9, 9],orientation:6} },
      { id: 3, txt: '热门电影榜', type: 1, action: '3', icon: fullIcon, iconf: fullIconf },
      { 
        id: 4, txt: '开通会员', type: 2, icon: vipIconf, action: '4',
        gradientBg: {colors:['#FFE398','#EEB364'], cornerRadii4: [9, 9, 9, 9],orientation:6},
        vipDuration: '月度会员', price: 100, oPrice: 200
      },
      // { 
      //   id: 4, txt: '开通会员', type: 3, img: logo2, action: '4',
      // }
    ]
  }
}