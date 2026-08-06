import { SiteHeader } from '@/components/site-header'
import { Hero } from '@/components/hero'
import { About } from '@/components/about'
import { Services } from '@/components/services'
import { Routes } from '@/components/routes'
import { Differentials } from '@/components/differentials'
import { SocialProof } from '@/components/social-proof'
import { FinalCta } from '@/components/final-cta'
import { SiteFooter } from '@/components/site-footer'

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <About />
        <Services />
        <Routes />
        <Differentials />
        <SocialProof />
        <FinalCta />
      </main>
      <SiteFooter />
    </>
  )
}
