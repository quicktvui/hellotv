export function replacePlaceholders(template, replacements): string {
  return template.replace(/\$\{(\w+)\}/g, (match, placeholder) => {
    return replacements[placeholder] || '' // 如果替换项不存在，则返回空字符串
  })
}