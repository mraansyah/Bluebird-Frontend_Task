import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import SearchPage from './pages/SearchPage'
import VehicleDetailPage from './pages/VehicleDetailPage'
import WishlistPage from './pages/WishlistPage'
import MyBookPage from './pages/MyBookPage'

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/vehicle/:vehicleName" element={<VehicleDetailPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/mybook" element={<MyBookPage />} />
      </Routes>
    </Router>
  )
}