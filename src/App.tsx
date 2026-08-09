import { lazy, Suspense, useCallback, useState } from 'react'
import { LazyMotion, domAnimation } from 'framer-motion'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Index from './pages/Index'

const Gallery = lazy(() => import('./pages/Gallery'))
const Shop = lazy(() => import('./pages/Shop'))

function App() {
  const [hasPlayedIntro, setHasPlayedIntro] = useState(
    () => window.location.pathname !== '/',
  )
  const handleIntroComplete = useCallback(() => setHasPlayedIntro(true), [])

  return (
    <LazyMotion features={domAnimation} strict>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Index
                showIntro={!hasPlayedIntro}
                onIntroComplete={handleIntroComplete}
              />
            }
          />
          <Route
            path="/galeria/"
            element={
              <Suspense fallback={<div className="min-h-screen bg-bg" />}>
                <Gallery />
              </Suspense>
            }
          />
          <Route
            path="/loja/"
            element={
              <Suspense fallback={<div className="min-h-screen bg-bg" />}>
                <Shop />
              </Suspense>
            }
          />
        </Routes>
      </BrowserRouter>
    </LazyMotion>
  )
}

export default App
