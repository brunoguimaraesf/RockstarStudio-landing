import { useCallback, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Seo from '../components/Seo'
import LoadingScreen from '../components/LoadingScreen'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Works from '../components/Works'
import ShopPromo from '../components/ShopPromo'
import ProcessCare from '../components/ProcessCare'
import AboutArtist from '../components/AboutArtist'
import ClientTypes from '../components/ClientTypes'
import Explorations from '../components/Explorations'
import InstagramFeed from '../components/InstagramFeed'
import Stats from '../components/Stats'
import ContactLocation from '../components/ContactLocation'
import Footer from '../components/Footer'

type IndexProps = {
  showIntro: boolean
  onIntroComplete: () => void
}

export default function Index({ showIntro, onIntroComplete }: IndexProps) {
  const [isLoading, setIsLoading] = useState(showIntro)
  const handleComplete = useCallback(() => {
    setIsLoading(false)
    onIntroComplete()
  }, [onIntroComplete])

  return (
    <>
      <Seo
        path="/"
        title="Nail Art e Nail Designer em Rio Verde - GO | Rockstar Studio"
        description="Rockstar Studio — nail art autoral, nail design, unhas em gel e press on artesanais em Rio Verde - GO. Do clássico ao gótico, kawaii e alternativo. Agende pelo WhatsApp."
      />
      <AnimatePresence>
        {isLoading && <LoadingScreen onComplete={handleComplete} />}
      </AnimatePresence>
      <Navbar />
      <main>
        <Hero active={!isLoading} />
        <Works />
        <ShopPromo />
        <ProcessCare />
        <AboutArtist />
        <ClientTypes />
        <Explorations />
        <InstagramFeed />
        <Stats />
        <ContactLocation />
        <Footer />
      </main>
    </>
  )
}
