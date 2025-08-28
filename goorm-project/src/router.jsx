import { lazy } from 'react'
import { Routes, Route } from 'react-router'

import RootLayout from '@/layouts/RootLayout'
import { ROUTES } from '@/lib/routes'
import AuthLayout from '@/routes/auth/AuthLayout'
import Login from '@/routes/auth/Login'
import Register from '@/routes/auth/Register'
import Home from '@/routes/Home'
import NotFound from '@/routes/NotFound'
import PostCreate from '@/routes/posts/PostCreate'
import PostEdit from '@/routes/posts/PostEdit'
import PostsList from '@/routes/posts/PostList'
import PostView from '@/routes/posts/PostView'
import Practice from '@/routes/practice/Practice'
import Mypage from '@/routes/user/Mypage'

const Profile = lazy(() => import('@/routes/member/Profile'))

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path={ROUTES.MEMBER.ROOT}>
          <Route path={ROUTES.MEMBER.PROFILE} element={<Profile />} />
        </Route>
        <Route element={<AuthLayout />}>
          <Route path={ROUTES.AUTH.LOGIN} element={<Login />} />
          <Route path={ROUTES.AUTH.REGISTER} element={<Register />} />
        </Route>
        <Route path={ROUTES.USER.ROOT} element={<Mypage />}>
          {/* <Route path={ROUTES.USER.LOGIN} element={<Mypage />} /> */}
        </Route>
        <Route path={ROUTES.PRACTICE.PRACTICE} element={<Practice />} />
        <Route path={ROUTES.POST.ROOT} element={<PostsList />} />
        <Route path={ROUTES.POST.NEW} element={<PostCreate />} />
        <Route path={ROUTES.POST.DETAIL()} element={<PostView />} />
        <Route path={ROUTES.POST.EDIT()} element={<PostEdit />} />
        <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
      </Route>
    </Routes>
  )
}
