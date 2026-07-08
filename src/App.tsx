import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Index from './pages/Index'
import Gallery from './pages/Gallery'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/galeria" element={<Gallery />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
