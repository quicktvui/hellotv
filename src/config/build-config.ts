const debug = true //true:输出日志模式，  false: 屏蔽日志模式
const env = false // true:接口测试环境，false：接口正式环境
export default {
  DEBUG: debug,
  testEnv: env,
  // 使用模拟数据
  useMockData: false,
  //版本号
  VUE_PLUGIN_VERSION:  1,
  //是低端设备
  isLowEndDev: false,
  //ES包名
  packageName: 'es.tv.huan.hellotv',
  //域名
  // requestBaseUrl: process.env.requestBaseUrl || 'http://cms.hmon.tv/es_single/api',
  requestBaseUrl: 'http://mockapi.quicktv.net/api',
  // requestBaseUrl: 'http://192.168.35.254:8080/api',
  //首页内容请求数量
  tabContentPageSize: 10,
  // 默认源
  defaultSourceUrl: ''
}
