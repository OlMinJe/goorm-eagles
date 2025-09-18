import Link from 'next/link';

export default function Header(props: { onOpenSidebar?: () => void }) {
  const { onOpenSidebar } = props;
  return (
    <header className="sticky top-0 z-40 backdrop-blur">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          {/* 모바일 햄버거 */}
          <button type="button" className="md:hidden rounded-md border px-3 py-2" aria-controls="app-sidebar" onClick={onOpenSidebar}>
            <span className="sr-only">메뉴 열기</span>☰
          </button>
          <Link href={'/'} className="text-lg font-semibold text-brand">
            MyApp
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Link href={'/login'}>로그인</Link>
          <Link href={'/register'}>회원가입</Link>
        </div>
      </div>
    </header>
  );
}
