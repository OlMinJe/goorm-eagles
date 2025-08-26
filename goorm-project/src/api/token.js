let _token = ''

export const token = {
  get: () => _token,
  set: (t) => {
    _token = t || ''
  },
  clear: () => {
    _token = ''
  },
}
