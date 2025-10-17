import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import CategorySlider from '../components/CategorySlider'
import Footer from '../components/Footer'
import LikeButton from '../components/LikeButton'
import ShareButton from '../components/ShareButton'
import BookButton from '../components/BookButton'
import { Star } from 'lucide-react'

// Helper function untuk mendapatkan URL gambar berdasarkan nama kendaraan
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
  
  // Mengembalikan imageURL default jika bukan kendaraan khusus
  return null
}

export default function VehicleDetailPage() {
  const { vehicleName } = useParams()
  const navigate = useNavigate()
  const vehicles = useSelector((state) => state.vehicle.vehicles)
  const [vehicle, setVehicle] = useState(null)
  const [loading, setLoading] = useState(true)

  

  useEffect(() => {
    if (vehicles.length > 0) {
      // Decode URL parameter dan cari kendaraan berdasarkan nama
      const decodedVehicleName = decodeURIComponent(vehicleName).replace(/-/g, ' ')
      
      // Cari kendaraan dengan nama yang cocok (case insensitive)
      const foundVehicle = vehicles.find(v => 
        v.vehicle?.toLowerCase() === decodedVehicleName.toLowerCase()
      )
      
      setVehicle(foundVehicle)
      setLoading(false)
    }
  }, [vehicles, vehicleName])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-16 flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-16 flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Vehicle Not Found</h2>
            <p className="text-gray-600 mb-4">The vehicle you're looking for doesn't exist.</p>
            <button 
              onClick={() => navigate('/')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Category Slider dibawah navbar */}
      <div className="pt-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CategorySlider />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Vehicle Images */}
          <div className="space-y-4">
            <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg overflow-hidden">
              <img 
                src={getVehicleImage(vehicle.vehicle) || vehicle.imageURL} 
                alt={vehicle.vehicle}
                className="height-cars"
              />
            </div>
            
            {/* Tombol Like dan Share dibawah image */}
            <div className="flex justify-center gap-4">
              <ShareButton />
              <LikeButton vehicle={vehicle} />
            </div>
          </div>

          {/* Vehicle Details */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {vehicle.vehicle}
              </h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-gray-600">4.8 (128 reviews)</span>
                </div>
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-600">{vehicle.location}</span>
              </div>
            </div>

            {/* Description diatas harga */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Description</h3>
              <p className="text-gray-700 leading-relaxed">
                {Array.isArray(vehicle.description) 
                  ? vehicle.description.join('. ') 
                  : vehicle.description || `Experience the perfect blend of comfort and performance with this vehicle.`}
              </p>
            </div>

            {/* Price dengan Book Button di kanan */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Starting from</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {vehicle.price}
                  </p>
                  <p className="text-sm text-gray-600">per day</p>
                </div>
                <div>
                  <BookButton vehicle={vehicle} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}