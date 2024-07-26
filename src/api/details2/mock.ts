import fullIcon from '../../assets/ic_media_full_button_normal.png'
import fullIconf from '../../assets/ic_media_full_button_focused.png'
// import vipIconf from '../../assets/my/vip_f.png'
// import logo2 from '../../assets/ic_seekbar.png'

import { IvideoDes } from './types'
import { tUid } from '../../tools/common'

// 测试视频播放地址数据
const videos = [
  "http://qcloudcdn.a311.ottcn.com/channelzero/2024/02/05/d477660a-3eb6-4c7f-b82b-0b61c035505c.mp4",
  "http://qcloudcdn.a311.ottcn.com/channelzero/2024/02/05/110e7a35-1ba3-4d87-a8ea-0f462de40866.mp4",
  "http://qcloudcdn.a311.ottcn.com/channelzero/2024/02/05/5fc2d6dd-0566-4c70-a4ba-be6e47e39252.mp4",
  "http://qcloudcdn.a311.ottcn.com/channelzero/2024/02/05/a87f2fd0-579c-4d4e-9bb7-4183f6bd3604.mp4"
]
export const imgs = ["http://lexueimg.educdn.huan.tv/eduImg/upload/img5/20210709105200002.png","http://lexueimg.educdn.huan.tv/eduImg/upload/img5/20210708174600015.png","http://lexueimg.educdn.huan.tv/eduImg/upload/img5/20210708174500042.png","http://lexueimg.educdn.huan.tv/eduImg/upload/img4/20201125100100047.jpg","http://qcloudimg.moss.huan.tv/project/lexue_education/lexue/2021/07/12/b9555d18f12547c48c401e692975bcd0.png","http://qcloudimg.moss.huan.tv/project/lexue_education/lexue/2021/05/27/ab522119fe0a42bf9b68ded436d1701d.jpg","http://lexueimg.educdn.huan.tv/eduImg/upload/img4/20190718165000032.jpg","http://lexueimg.educdn.huan.tv/eduImg/upload/img4/20220908143800047.jpg","http://lexueimg.educdn.huan.tv/eduImg/upload/img4/20211014101900028.jpg","http://lexueimg.educdn.huan.tv/eduImg/upload/img4/20210709105300019.png","http://lexueimg.educdn.huan.tv/eduImg/upload/img4/20190801144300020.jpg","http://lexueimg.cedock.com/eduImg/upload/img4/20230810153200058.jpg","http://lexueimg.cedock.com/eduImg/upload/img4/20230725143100016.png","http://qcloudimg.moss.huan.tv/project/lexue_education/lexue/2021/05/27/16921a53abe74d25ad14862add0d2193.jpg","http://lexueimg.cedock.com/eduImg/upload/img4/20210618110500033.png","http://lexueimg.educdn.huan.tv/eduImg/upload/img4/20210709105400005.png","http://qcloudimg.moss.huan.tv/project/lexue_education/lexue/2021/05/27/fd5069d8346f4c1b9198e73dfd440d3c.jpg","http://lexueimg.educdn.huan.tv/eduImg/upload/img4/20190718165200013.jpg","http://lexueimg.educdn.huan.tv/eduImg/upload/img4/20211102135900000.jpg","http://qcloudimg.moss.huan.tv/project/lexue_education/lexue/2021/09/29/cad9ef5b816c4a0bb21e573dcbf930e4.贝瓦爱数学.jpg","http://lexueimg.educdn.huan.tv/eduImg/upload/img4/20190802162600043.jpg","http://lexueimg.educdn.huan.tv/eduImg/upload/img4/20220228135800006.png","http://lexueimg.educdn.huan.tv/eduImg/upload/img4/20210802164700002.jpg","http://lexueimg.educdn.huan.tv/eduImg/upload/img4/20211102101400033.png","http://lexueimg.educdn.huan.tv/eduImg/upload/img4/20190809140600014.jpg","http://lexueimg.educdn.huan.tv/eduImg/upload/img4/20190725140800007.jpg","http://lexueimg.educdn.huan.tv/eduImg/upload/img4/20191029163800054.jpg","http://lexueimg.educdn.huan.tv/eduImg/upload/img5/20190801144400042.jpg","http://lexueimg.educdn.huan.tv/eduImg/upload/img5/20220222155100054.jpg","http://lexueimg.educdn.huan.tv/eduImg/upload/img5/20220111160600011.jpg","http://lexueimg.educdn.huan.tv/eduImg/upload/img4/20220302153800048.png","http://lexueimg.educdn.huan.tv/eduImg/upload/img4/20220111160500009.jpg","http://qcloudimg.moss.huan.tv/project/lexue_education/lexue/2021/06/23/9518866226e94a1cbf5acabdabe537a5.png","http://lexueimg.educdn.huan.tv/eduImg/upload/img4/20190718165000001.jpg","http://lexueimg.educdn.huan.tv/eduImg/upload/img4/20211102135600034.jpg","http://qcloudimg.moss.huan.tv/project/lexue_education/lexue/2020/09/18/715caa7be82f4acb9529d1664bb07790.png"]
const titles = ['复仇者联盟系列','福尔摩斯小姐：伦敦厄运 Enola Holmes','权力的游戏','生化危机: 死亡岛']

function getRandomInt(min, max) {
  min = Math.ceil(min); // 确保min是整数
  max = Math.floor(max); // 确保max是整数
  return Math.floor(Math.random() * (max - min)) + min;
}
export const getMockVideoData = (index:number):IvideoDes => {
  const title = titles[getRandomInt(0, titles.length)] + Math.random()
  return {
    title: title, id: tUid.cleateId()+index,
    vUrl: videos[index % videos.length],
    vPoster: imgs[getRandomInt(0, imgs.length)],
    subTitle: '副标题'+title,
    showTime: '2024-01-10',
    des: `${title};${title};${title};${title};${title};${title};${title};${title};
    ${title};${title};${title};${title};${title};${title};${title};${title};`,
    status: '已完结',
    playNumber: 1000,
    actors: '灶门炭治郎：花江夏树 灶门称豆子：鬼头明里 我妻善逸：下野纮 嘴平伊之助：松冈祯丞 富冈义勇：樱井孝宏fdjlsa',
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
      { id: 2, txt: '视频详情', type: 1, action: '2', router:{name:'d2Introduction'}, icon: fullIcon, iconf: fullIconf, gradientBg:{colors:['#00C7FF','#0057FF'], cornerRadii4: [9, 9, 9, 9],orientation:6},gradientBgf:{colors:['#FFE398','#EEB364'], cornerRadii4: [9, 9, 9, 9],orientation:6} },
      { id: 3, txt: '热门电影榜', type: 1, action: '3', router:{name:'ranking'}, icon: fullIcon, iconf: fullIconf },
      // { 
      //   id: 4, txt: '开通会员', type: 2, icon: vipIconf, action: '4',
      //   gradientBg: {colors:['#FFE398','#EEB364'], cornerRadii4: [9, 9, 9, 9],orientation:6},
      //   vipDuration: '月度会员', price: 100, oPrice: 200
      // },
      // { 
      //   id: 4, txt: '开通会员', type: 3, img: logo2, action: '4',
      // }
    ],
    selectionTotalSize: 1000
  }
}