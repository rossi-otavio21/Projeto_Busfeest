import { Hero } from '@/components/sections/home/hero'
import { About } from '@/components/sections/home/about'
import { Highlights } from '@/components/sections/home/highlights'
import { NextTripCta } from '@/components/sections/home/next-trip-cta'

export default function Page() {
  return (
    <main id="conteudo-principal" tabIndex={-1} className="outline-none">
      <Hero />
      <About />
      <Highlights />
      <NextTripCta />
    </main>
  )
}
