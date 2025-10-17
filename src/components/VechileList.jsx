import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import LikeButton from './LikeButton'

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

export default function VehicleList() {
  const vehicles = useSelector((state) => state.vehicle.vehicles)
  const navigate = useNavigate()

  const handleCardClick = (vehicleName) => {
    const urlVehicleName = encodeURIComponent(vehicleName.toLowerCase().replace(/\s+/g, '-'))
    navigate(`/vehicle/${urlVehicleName}`)
  }

  if (!vehicles.length)
    return <p className="mt-8 text-center text-gray-500">Loading vehicles...</p>

  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold mb-3">Available Vehicles</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...vehicles]
          .sort(() => Math.random() - 0.5)
          .slice(0, 4)
          .map((v, index) => (
          <div 
            key={index} 
            className="bg-white rounded-xl shadow-md p-4 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 hover:shadow-blue-500/20 transition-all duration-300 cursor-pointer transform group"
            onClick={() => handleCardClick(v.vehicle)}
          >
            <img
              src={getVehicleImage(v.vehicle) || v.imageURL}
              alt={v.vehicle}
              className="height-cars mb-2 group-hover:scale-105 transition-transform duration-300"
            />
            <div className="flex justify-between items-center mb-1">
              <p className="font-semibold text-gray-700">{v.vehicle}</p>
              <div onClick={(e) => e.stopPropagation()}>
                <LikeButton id={v.vehicle} />
              </div>
            </div>
            <p className="text-sm text-blue-600 font-medium">{v.price}</p>
            <ul className="mt-2 text-xs text-gray-500 list-disc ml-4">
              {v.description?.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}