/**
 * 去掉重复
 * @param {Array} value 数组值
 */
export function uniq (value) {
  let setValue = new Set(value)
  return Array.from(setValue)
}

export const getSearchParams = () => {
  let params = decodeURI(location.search.slice(1))
  let ret = {}
  if (params) {
    params = params.split('&')
    params.forEach(param => {
      let item = param.split('=')
      ret[item[0]] = item[1]
    })
  }
  return ret
}

/**
 * 分组数据
 * @param {*} data 数据列表
 * @param {*} size 每组显示的条数
 */
export const groupBy = (data, size) => {
  const result = data.reduce((r, t) => {
    r.current.push(t)
    if (r.current.length === size) {
      r.list.push(r.current)
      r.current = []
    }
    return r
  }, { list: [], current: [] })

  if (result.current.length) {
    result.list.push(result.current)
  }

  return result.list
}


