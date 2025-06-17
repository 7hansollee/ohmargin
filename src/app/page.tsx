import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { HeroSection } from '@/components/home/HeroSection'

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <Header />
      <HeroSection />
      <Footer />
    </div>
  )
}
