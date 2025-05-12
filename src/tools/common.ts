export function replacePlaceholders(template, replacements): string {
  return template.replace(/\$\{(\w+)\}/g, (match, placeholder) => {
    return replacements[placeholder] || '' // 如果替换项不存在，则返回空字符串
  })
}

export function getHistorySubTitle(item) {
  //通过description1可以获得总集数
  let head = `第${item.episode}集 `
  if (item.description1 == '共1集') {
    head = ''
  }
  return (
    item.totalPlayTime > 0 ? `${head}已看${Math.floor((item.currentPlayTime / item.totalPlayTime) * 100)}%` : `${head}已看0%`
  ).replace('已看0%', '不足1%')
}
