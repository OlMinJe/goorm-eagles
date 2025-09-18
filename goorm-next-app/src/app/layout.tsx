import './globals.css'

export const metadata = {
  title: 'Next.js 15 Perf Lab',
  description: 'Next15 + Tailwind 성능 측정/개선 실습 템플릿',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <header className="border-b border-slate-800/80">
          <div className="section flex items-center justify-between">
            <h1 className="h2">Next.js 15 성능 랩</h1>
            <nav className="flex gap-2">
              <a className="btn btn-ghost" href="/">
                Home
              </a>
              <a className="btn btn-primary" href="/bad">
                /bad
              </a>
              <a className="btn btn-ghost" href="/good">
                /good
              </a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="section text-sm text-slate-400 border-t border-slate-800/60">
          DevTools → Performance / Lighthouse / Network / Coverage 로 전/후 비교하세요.
        </footer>
      </body>
    </html>
  )
}
