import { lazy, Suspense } from 'react'
import { LazyMotion, domAnimation } from 'framer-motion'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Index from './pages/Index'

const Gallery = lazy(() => import('./pages/Gallery'))

function App() {
  return (
    <LazyMotion features={domAnimation} strict>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route
            path="/galeria"
            element={
              <Suspense fallback={<div className="min-h-screen bg-bg" />}>
                <Gallery />
              </Suspense>
            }
          />
        </Routes>
      </BrowserRouter>
    </LazyMotion>
  )
}

export default App
