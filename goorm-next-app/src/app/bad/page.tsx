import ContextAbuse from '@/components/bad/ContextAbuse'

export const dynamic = 'force-dynamic'

export default function BadPage() {
  return (
    <>
      {/* <Hero /> */}
      <ContextAbuse />

      {/* <Features />
      <Gallery />
      <CTA />
      <UnstableProps />
      <KeyedList />
      <EffectAbuse />
      <MemoAbuse /> */}
    </>
  )
}
