const debug = true  // 调试模式
const env = false   // true 测试环境、false 正式环境

export default {
  debug: debug,
  testEnv: env,
  // 使用模拟数据
  useMockData: false,
  // ES包名
  packageName: 'es.tv.huan.hellotv',
  // CMS
  requestBaseUrl: process.env.requestBaseUrl || '',
  // 首页内容请求数量
  tabContentPageSize: 3,
  // 直播源
  defaultSourceUrl: process.env.defaultSourceUrl || ''
}
