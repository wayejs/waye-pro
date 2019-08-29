export default {
  get (key) {
    let value = window.localStorage.getItem(key)

    try {
      return JSON.parse(value)
    } catch (e) {
      return value
    }
  },

  set (key, value) {
    value = typeof value === 'string' ? value : JSON.stringify(value)
    window.localStorage.setItem(key, value)
  },

  remove (key) {
    window.localStorage.removeItem(key)
  },

  clear () {
    window.localStorage.clear()
  }
}
