export const mockMediaList = [
  {
    channelId: '001',
    channelName: 'CCTV-1高清',
    isVip: true,
    program: '我的阿勒泰02',
    nextProgram: '边水往事08',
    mediaSourceList: {
      index: 0,
      list: [{ uri: 'https://extcdn.hsrc.tv/channelzero/2024/02/06/004d30f9-1d06-4ee4-9d96-bb5fdb14f52f.mp4' }]
    }
  },
  {
    channelId: '002',
    channelName: 'CCTV-2高清',
    isVip: false,
    program: '舌尖上的中国',
    nextProgram: '大明王朝1566(28)',
    mediaSourceList: {
      index: 0,
      list: [{ uri: 'https://extcdn.hsrc.tv/channelzero/2024/01/29/6f0a3144-7f22-4f9d-9691-cc7f2263e2fd.mp4' }]
    }
  },
  {
    channelId: '003',
    channelName: 'CCTV-3高清',
    isVip: false,
    program: '在中国大地上边走边看',
    nextProgram: '新闻联播',
    mediaSourceList: {
      index: 0,
      list: [{ uri: 'https://extcdn.hsrc.tv/data_center/videos/SHORT/DEFAULT/2022/10/27/d4e29cbf-5b15-4523-b9c8-80f18fa76275.mp4' }]
    }
  },
  {
    channelId: '004',
    channelName: 'CCTV-4高清',
    isVip: false,
    program: '边水往事08',
    nextProgram: '大头儿子小头爸爸',
    mediaSourceList: {
      index: 0,
      list: [{ uri: 'https://extcdn.hsrc.tv/data_center/videos/SHORT/DEFAULT/2023/09/17/22edb94d-8ffc-4736-a633-3f9e38c096e8.mp4' }]
    }
  },
  {
    channelId: '005',
    channelName: 'CCTV-5高清',
    isVip: false,
    program: '龙的传人',
    nextProgram: '家有喜事2022',
    mediaSourceList: {
      index: 0,
      list: [{ uri: 'https://extcdn.hsrc.tv/channelzero/2024/02/05/a87f2fd0-579c-4d4e-9bb7-4183f6bd3604.mp4' }]
    }
  }
]

export const mockCategories = [
  { type: 1, name: '开通服务' },
  { type: 2, name: '央视频道', startIndex: 0 },
  { type: 2, name: '卫视频道', startIndex: 3 },
  { type: 2, name: '热门频道', startIndex: 6 },
  { type: 3, name: '个人中心' }
]

export const mockChannels = [
  { type: 1, categoryIndex: 1, id: '001', name: 'CCTV-1高清', program: '我的阿勒泰02', isVip: true },
  { type: 1, categoryIndex: 1, id: '002', name: 'CCTV-2高清', program: '舌尖上的中国' },
  { type: 1, categoryIndex: 1, id: '003', name: 'CCTV-3高清', program: '在中国大地上边走边边边边边' },
  { type: 1, categoryIndex: 2, id: '004', name: 'CCTV-4高清', program: '边水往事08', isVip: true },
  { type: 1, categoryIndex: 2, id: '005', name: 'CCTV-5高清', program: '边水往事09' },
  { type: 1, categoryIndex: 2, id: '006', name: 'CCTV-6高清', program: '龙的传人', isVip: true },
  { type: 1, categoryIndex: 3, id: '007', name: 'CCTV-7高清', program: '新闻联播' },
  { type: 1, categoryIndex: 3, id: '008', name: 'CCTV-8高清', program: '国足0-7大败日本' },
  { type: 1, categoryIndex: 3, id: '009', name: 'CCTV-9高清', program: '大头儿子小头爸爸' },
  { type: 1, categoryIndex: 3, id: '010', name: 'CCTV-10高清', program: '家有喜事2022' }
]

export const mockPrograms = {
  '001': [
    { type: 1, channelId: '001', program: '我的阿勒泰02', time: '15:00-17:45', tips: '正在播放', isVip: true, isPlaying: true },
    { type: 1, channelId: '001', program: '我的阿勒泰03', time: '17:45-19:00', tips: '未开始' },
    { type: 1, channelId: '001', program: '我的阿勒泰04', time: '19:00-21:45', tips: '未开始' },
    { type: 1, channelId: '001', program: '我的阿勒泰05', time: '21:45-23:00', tips: '未开始' },
    { type: 1, channelId: '001', program: '我的阿勒泰06', time: '23:00-01:45', tips: '未开始' }
  ],
  '003': [
    { type: 1, channelId: '003', program: '大头儿子小头爸爸10', time: '15:00-17:45', tips: '正在播放', isVip: false, isPlaying: true },
    { type: 1, channelId: '003', program: '大头儿子小头爸爸11', time: '17:45-19:00', tips: '未开始' },
    { type: 1, channelId: '003', program: '大头儿子小头爸爸12', time: '19:00-21:45', tips: '未开始' },
    { type: 1, channelId: '003', program: '大头儿子小头爸爸13', time: '21:45-23:00', tips: '未开始' },
    { type: 1, channelId: '003', program: '大头儿子小头爸爸14', time: '23:00-01:45', tips: '未开始' },
    { type: 1, channelId: '003', program: '大头儿子小头爸爸15', time: '23:00-01:45', tips: '未开始' },
    { type: 1, channelId: '003', program: '大头儿子小头爸爸16', time: '23:00-01:45', tips: '未开始' },
    { type: 1, channelId: '003', program: '大头儿子小头爸爸17', time: '23:00-01:45', tips: '未开始' }
  ]
}
