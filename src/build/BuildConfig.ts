const debug = true //true:输出日志模式，  false: 屏蔽日志模式
const env = false // true:接口测试环境，false：接口正式环境
export default {
  debug: debug,
  testEnv: env,
  // 使用模拟数据
  useMockData: false,
  //ES包名
  packageName: 'es.tv.huan.hellotv',
  //域名
  requestBaseUrl: process.env.requestBaseUrl || 'http://cms.hmon.tv/es_single/api',
  //首页内容请求数量
  tabContentPageSize: 10,
  // 默认源
  defaultSourceUrl: ''
}
