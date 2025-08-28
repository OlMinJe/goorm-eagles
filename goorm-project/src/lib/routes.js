export const ROUTES = {
  HOME: '/',
  MEMBER: {
    ROOT: '/member',
    PROFILE: '/member/profile',
  },
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
  },
  USER: {
    ROOT: '/mypage',
  },
  PRACTICE: {
    PRACTICE: '/practice',
    THEME: '/theme',
    AUTH: '/auth',
  },
  POST: {
    ROOT: '/posts',
    NEW: '/posts/new',
    DETAIL: (id = ':id') => `/posts/${id}`,
    EDIT: (id = ':id') => `/posts/${id}/edit`,
  },
  NOT_FOUND: '*',
}
