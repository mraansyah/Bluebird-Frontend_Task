import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toggleBooking } from '../redux/vehicleSlice'
import Navbar from '../components/Navbar'
import CategorySlider from '../components/CategorySlider'
import Footer from '../components/Footer'
import { Calendar, Clock, CheckCircle, X } from 'lucide-react'

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

export default function MyBookPage() {
  const dispatch = useDispatch()
  const purchaseHistory = useSelector((state) => state.vehicle.purchaseHistory)
  const navigate = useNavigate()

  const handleCardClick = (vehicleName) => {
    const urlFriendlyName = encodeURIComponent(vehicleName.toLowerCase().replace(/\s+/g, '-'))
    navigate(`/vehicle/${urlFriendlyName}`)
  }

  const handleCancelBooking = (e, vehicle) => {
    e.stopPropagation()
    dispatch(toggleBooking(vehicle))
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CategorySlider />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-600">Riwayat pemesanan kendaraan Anda</p>
        </div>

        {purchaseHistory.length === 0 ? (
          <div className="text-center py-16">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-600 mb-2">Belum Ada Booking</h2>
            <p className="text-gray-500 mb-6">Belum ada kendaraan yang dipesan</p>
            <button 
              onClick={() => navigate('/')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Jelajahi Kendaraan
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {purchaseHistory.map((booking, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl shadow overflow-hidden hover:shadow-lg transition"
              >
                <div className="flex flex-col lg:flex-row">
                  <div 
                    className="lg:w-1/2 bg-gray-50 p-4 cursor-pointer"
                    onClick={() => handleCardClick(booking.vehicle)}
                  >
                    <img
                      src={getVehicleImage(booking.vehicle) || booking.imageURL}
                      alt={booking.vehicle}
                      className="height-cars"
                    />
                  </div>
                  <div className="lg:w-1/2 p-6 lg:p-8 flex flex-col justify-between">
                    <div 
                      className="cursor-pointer"
                      onClick={() => handleCardClick(booking.vehicle)}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-sm font-medium text-green-600">Booked</span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{booking.vehicle}</h3>
                      <div className="text-3xl font-bold text-blue-600 mb-4">{booking.price}</div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                        <Clock className="w-4 h-4" />
                        <span>Dipesan pada: {formatDate(booking.purchaseDate)}</span>
                      </div>

                      {Array.isArray(booking.description) && (
                        <ul className="list-disc ml-5 space-y-2 text-gray-700">
                          {booking.description.map((d, idx) => <li key={idx}>{d}</li>)}
                        </ul>
                      )}
                    </div>
                    
                    <div className="mt-4 flex gap-3">
                      <div className="flex-1 p-4 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-2 text-green-700">
                          <CheckCircle className="w-4 h-4" />
                          <span className="font-medium">Booking Berhasil</span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => handleCancelBooking(e, booking)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}