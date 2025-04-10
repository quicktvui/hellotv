/**
 * 阿拉伯数字转中文
 * @param num 阿拉伯数字
 * @returns
 */
export function numberToChinese(num) {
  if (num === 0) return '零'

  const digits = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
  const units = ['', '十', '百', '千']
  const bigUnits = ['', '万', '亿', '兆']

  let result = ''
  let zero = false // 用于处理连续的零
  let section = 0 // 当前处理的节（万、亿等）

  while (num > 0) {
    let part = num % 10000 // 每次处理四位数
    if (part !== 0) {
      let partResult = ''
      for (let i = 0; part > 0; i++) {
        const digit = part % 10
        if (digit !== 0) {
          if (zero) partResult = digits[0] + partResult // 处理中间的零
          partResult = digits[digit] + units[i] + partResult
        } else {
          zero = true
        }
        part = Math.floor(part / 10)
      }
      result = partResult + bigUnits[section] + result
      zero = false // 每处理完一节，重置零标志
    } else {
      zero = true
    }
    num = Math.floor(num / 10000)
    section++
  }

  // 特殊处理：如果结果以“一十”开头，改为“十”
  if (result.startsWith('一十')) {
    result = result.replace('一十', '十')
  }

  return result
}

export function isJSON(str) {
  if (typeof str == 'string') {
    try {
      const obj = JSON.parse(str)
      return !!(typeof obj == 'object' && obj)
    } catch (e) {
      qt.log.e('isJson', e)
      return false
    }
  }
}
