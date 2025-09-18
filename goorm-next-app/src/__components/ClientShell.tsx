'use client'

import Footer from '@/components/Footer'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import { ReactNode, useState } from 'react'

export default function ClientShell({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const open = () => setSidebarOpen(true)
  const close = () => setSidebarOpen(false)

  return (
    <div className="min-h-dvh bg-gray-50 text-gray-900">
      <div className="container h-full mx-auto grid grid-cols-1 gap-6 px-4 py-6 md:grid-cols-[240px_1fr]">
        <Sidebar open={sidebarOpen} onClose={close} />

        <div className="flex flex-col gap-6 h-full">
          <Header onOpenSidebar={open} />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </div>
    </div>
  )
}
