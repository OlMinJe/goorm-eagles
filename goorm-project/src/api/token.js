let _token = ''

export const token = {
  set: (t) => {
    _token = t || ''
  },
  clear: () => {
    _token = ''
  },
}
