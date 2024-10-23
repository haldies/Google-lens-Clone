


import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import HomePage from './components/Home'
import './index.css'


import ProdukDrawer from './components/Produk'



function App() {
  return (
    <>

      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tes" element={<ProdukDrawer />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
