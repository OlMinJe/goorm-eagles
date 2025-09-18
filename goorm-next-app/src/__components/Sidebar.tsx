'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

export const ROUTES = {
  HOME: '/',
  MEMBER: {
    ROOT: '/member',
    PROFILE: '/member/profile',
  },
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    MYPAGE: '/mypage',
  },
  PRACTICE: {
    THEME: '/theme',
    AUTH: '/auth',
    PRACTICE: '/practice/practice',
    CALLMEMO: '/practice/callmemo',
  },
  NOT_FOUND: '*',
} as const;

export default function Sidebar(props: { open: boolean; onClose?: () => void }) {
  const { open = false, onClose = () => {} } = props;

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <aside
        id="app-sidebar"
        className="sticky top-5 hidden h-[calc(100dvh-2.5rem)] rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:block dark:border-zinc-800 dark:bg-zinc-900"
        aria-label="사이드바"
      >
        <h2 className="mb-3 px-2 text-sm font-semibold text-gray-700 dark:text-zinc-200">메뉴</h2>
        <SidebarLinks className="px-1" onNavigate={onClose} />
      </aside>

      <div className={`fixed inset-0 z-50 md:hidden transition ${open ? 'visible' : 'invisible'}`} aria-hidden={!open}>
        <button
          type="button"
          className={`absolute inset-0 bg-black/30 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`}
          onClick={onClose}
          aria-label="배경 닫기"
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="모바일 내비게이션"
          className={`absolute left-0 top-0 h-full w-72 transform bg-white p-4 shadow-xl transition-transform ${
            open ? 'translate-x-0' : '-translate-x-full'
          } dark:bg-zinc-900`}
        >
          <div className="mb-4 flex items-center justify-between">
            <span className="text-base font-semibold text-gray-800 dark:text-zinc-100">메뉴</span>
            <button
              onClick={onClose}
              className="rounded-md border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              닫기
            </button>
          </div>
          <SidebarLinks onNavigate={onClose} />
        </div>
      </div>
    </>
  );
}

function SidebarLinks(props: { className?: string; onNavigate?: () => void }) {
  const { className = '', onNavigate } = props;

  const links: Array<{ href: string; label: string }> = [
    { href: ROUTES.MEMBER.PROFILE, label: '프로필' },
    { href: ROUTES.PRACTICE.THEME, label: '테마' },
    { href: ROUTES.PRACTICE.AUTH, label: '인증 테스트' },
    { href: ROUTES.PRACTICE.PRACTICE, label: '연습(useEffect)' },
    { href: ROUTES.PRACTICE.CALLMEMO, label: '연습(useCallback, useMemo)' },
  ];

  return (
    <nav className={`space-y-1 ${className}`}>
      <ul className="flex flex-col gap-1">
        {links.map(({ href, label }) => (
          <li key={href}>
            <NavItem href={href} onClick={onNavigate}>
              {label}
            </NavItem>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function NavItem(props: { href: string; children: ReactNode; onClick?: () => void }) {
  const { href, children, onClick } = props;
  const pathname = usePathname();
  const isActive = pathname === href;

  const base =
    'group flex items-center gap-2 rounded-md px-2.5 py-2 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500';
  const active = 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300';
  const inactive = 'text-gray-700 hover:bg-gray-100 dark:text-zinc-200 dark:hover:bg-zinc-800';

  return (
    <Link href={href} onClick={onClick} className={[base, isActive ? active : inactive].join(' ')}>
      <span className="truncate">{children}</span>
      <span aria-hidden="true" className={'ml-auto h-1.5 w-1.5 rounded-full transition bg-transparent'} />
    </Link>
  );
}
