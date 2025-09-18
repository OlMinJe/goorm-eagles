import { NextResponse } from 'next/server'

export async function GET() {
  const items = Array.from({ length: 5000 }).map((_, i) => ({
    id: i + 1,
    name: `Ultra Product ${i + 1}`,
    price: Math.floor(Math.random() * 100000),
    desc: 'x'.repeat(1200),
    image: `https://picsum.photos/seed/p${i}/1200/800`,
  }))
  await new Promise((r) => setTimeout(r, 600))
  return NextResponse.json({ items })
}
