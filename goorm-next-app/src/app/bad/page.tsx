import ContextAbuse from '@/components/bad/ContextAbuse'
import CTA from '@/components/bad/CTA'
import EffectAbuse from '@/components/bad/EffectAbuse'
import Features from '@/components/bad/Features'
import Gallery from '@/components/bad/Gallery'
import Hero from '@/components/bad/Hero'
import KeyedList from '@/components/bad/KeyedList'
import MemoAbuse from '@/components/bad/MemoAbuse'
import UnstableProps from '@/components/bad/UnstableProps'

export const dynamic = 'force-dynamic'

export default function BadPage() {
  return (
    <>
      <Hero />
      <Features />
      <Gallery />
      <CTA />

      <ContextAbuse />
      <UnstableProps />
      <KeyedList />
      <EffectAbuse />
      <MemoAbuse />
    </>
  )
}
