import { useCallback, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import LoadingScreen from '../components/LoadingScreen'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Works from '../components/Works'
import ProcessCare from '../components/ProcessCare'
import AboutArtist from '../components/AboutArtist'
import ClientTypes from '../components/ClientTypes'
import Explorations from '../components/Explorations'
import InstagramFeed from '../components/InstagramFeed'
import Stats from '../components/Stats'
import ContactLocation from '../components/ContactLocation'
import Footer from '../components/Footer'

export default function Index() {
  const [isLoading, setIsLoading] = useState(true)
  const handleComplete = useCallback(() => setIsLoading(false), [])

  return (
    <>
      <AnimatePresence>
        {isLoading && <LoadingScreen onComplete={handleComplete} />}
      </AnimatePresence>
      <Navbar />
      <main>
        <Hero active={!isLoading} />
        <Works />
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

