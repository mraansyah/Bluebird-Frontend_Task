import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import CategorySlider from '../components/CategorySlider'
import Footer from '../components/Footer'
import LikeButton from '../components/LikeButton'
import { Heart } from 'lucide-react'


const getVehicleImage = (vehicleName) => {
  const lowerName = vehicleName.toLowerCase()
  
  if (lowerName.includes('hiace premio')) {
    return 'https://www.bluebirdgroup.com/storage/armadaservicecars/67adbc9e72449.png'
  } else if (lowerName.includes('hiace commuter')) {
    return 'https://www.bluebirdgroup.com/storage/armadaservicecars/67adbd014daa7.png'
  } else if (lowerName.includes('charlie bus')) {
    return 'https://www.bluebirdgroup.com/storage/armadaservicecars/6268f3f677c42.png'
  } else if (lowerName.includes('regular')) {
    return 'https://www.bluebirdgroup.com/storage/armadaservicecars/66b46d3c7f6fe.png'
  } else if (lowerName.includes('silver')) {
    return 'https://www.bluebirdgroup.com/storage/armadaservicecars/66b47218e288f.png'
  } else if (lowerName.includes('isuzu elf')) {
    return 'https://www.bluebirdgroup.com/storage/armadaservicecars/67adbc9e7a40b.png'
  }
  

  return null
}

export default function WishlistPage() {
  const wishlist = useSelector((state) => state.vehicle.wishlist)
  const navigate = useNavigate()

  const handleCardClick = (vehicleName) => {
    const urlFriendlyName = encodeURIComponent(vehicleName.toLowerCase().replace(/\s+/g, '-'))
    navigate(`/vehicle/${urlFriendlyName}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Category Slider */}
      <div className="pt-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CategorySlider />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
          <p className="text-gray-600">Kendaraan yang Anda sukai</p>
        </div>

        {wishlist.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-600 mb-2">Wishlist Kosong</h2>
            <p className="text-gray-500 mb-6">Belum ada kendaraan yang ditambahkan ke wishlist</p>
            <button 
              onClick={() => navigate('/')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Jelajahi Kendaraan
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlist.map((vehicle, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition cursor-pointer"
                onClick={() => handleCardClick(vehicle.vehicle)}
              >
                <img
                  src={getVehicleImage(vehicle.vehicle) || vehicle.imageURL}
                  alt={vehicle.vehicle}
                  className="height-cars mb-2"
                />
                <div className="flex justify-between items-center mb-1">
                  <p className="font-semibold text-gray-700">{vehicle.vehicle}</p>
                  <div onClick={(e) => e.stopPropagation()}>
                    <LikeButton vehicle={vehicle} />
                  </div>
                </div>
                <p className="text-sm text-blue-600 font-medium">{vehicle.price}</p>
                <ul className="mt-2 text-xs text-gray-500 list-disc ml-4">
                  {vehicle.description?.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}