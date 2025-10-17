import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import CategorySlider from '../components/CategorySlider'
import Footer from '../components/Footer'

const API_URL = 'https://private-f2fbfb-ridecar2.apiary-mock.com/vehicles'


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

export default function SearchPage() {
  const { search } = useLocation()
  const navigate = useNavigate()
  const query = new URLSearchParams(search).get('query') || ''
  const [vehicles, setVehicles] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')

  const handleDetailClick = (vehicleName) => {
    
    const urlFriendlyName = encodeURIComponent(vehicleName.toLowerCase().replace(/\s+/g, '-'))
    navigate(`/vehicle/${urlFriendlyName}`)
  }

  React.useEffect(() => {
    let ignore = false
    setLoading(true)
    fetch(API_URL)
      .then((r) => r.json())
      .then((data) => {
        if (ignore) return
        const all = Array.isArray(data?.type)
          ? data.type.flatMap((t) => t.car_type || [])
          : []
        setVehicles(all)
        setError('')
      })
      .catch(() => setError('Gagal memuat data'))
      .finally(() => { if (!ignore) setLoading(false) })
    return () => { ignore = true }
  }, [])

  const filtered = React.useMemo(() => {
    const q = query.toLowerCase()
    return vehicles.filter((v) => v.vehicle?.toLowerCase().includes(q))
  }, [vehicles, query])

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Hasil Pencarian</h1>
          <p className="text-lg text-gray-600">Menampilkan hasil untuk "{query}"</p>
        </div>

        <CategorySlider />

        <div className="mt-10 space-y-6">
          {loading && <p className="text-center text-gray-600">Memuat kendaraan...</p>}
          {!loading && error && <p className="text-center text-red-600">{error}</p>}
          {!loading && !error && filtered.length === 0 && (
            <p className="text-center text-gray-600">Tidak ada kendaraan yang cocok</p>
          )}

          {!loading && !error && filtered.length > 0 && filtered.map((car, i) => (
            <div key={i} className="bg-white rounded-xl shadow overflow-hidden hover:shadow-lg transition">
              <div className="flex flex-col lg:flex-row">
                <div className="lg:w-1/2 bg-gray-50 p-4">
                  <img
                    src={getVehicleImage(car.vehicle) || car.imageURL}
                    alt={car.vehicle}
                    className="height-cars"
                  />
                </div>
                <div className="lg:w-1/2 p-6 lg:p-8 flex flex-col justify-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{car.vehicle}</h3>
                  <div className="text-3xl font-bold text-blue-600 mb-4">{car.price}</div>

                  {Array.isArray(car.description) && (
                    <ul className="list-disc ml-5 space-y-2 text-gray-700">
                      {car.description.map((d, idx) => <li key={idx}>{d}</li>)}
                    </ul>
                  )}

                  <button 
                    className="mt-6 w-full sm:w-auto bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    onClick={() => handleDetailClick(car.vehicle)}
                  >
                    Lihat Detail
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
      </div>
      <Footer />
    </div>
  )
}