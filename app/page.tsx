import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { Hero } from '@/components/sections/hero'
import { About } from '@/components/sections/about'
import { Services } from '@/components/sections/services'
import { Routes } from '@/components/sections/routes'
import { Gallery } from '@/components/sections/gallery'
import { Differentials } from '@/components/sections/differentials'
import { SocialProof } from '@/components/sections/social-proof'
import { FinalCta } from '@/components/sections/final-cta'

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main id="conteudo-principal" tabIndex={-1} className="outline-none">
        <Hero />
        <About />
        <Services />
        <Routes />
        <Gallery />
        <Differentials />
        <SocialProof />
        <FinalCta />
      </main>
      <SiteFooter />
    </>
  )
}
