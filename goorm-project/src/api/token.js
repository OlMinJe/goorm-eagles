let _token = ''
const listeners = new Set()
function notify(value) {
  for (const fn of listeners) {
    try {
      fn(value)
    } catch (e) {
      console.error('[token subscriber error]', e)
    }
  }
}
export const token = {
  get: () => _token,
  set: (t) => {
    _token = t || ''
    notify(_token)
  },
  clear: () => {
    if (_token === '') {
      return
    }
    _token = ''
    notify(_token)
  },
  subscribe: (fn) => {
    listeners.add(fn)
    return () => listeners.delete(fn)
  },
}
