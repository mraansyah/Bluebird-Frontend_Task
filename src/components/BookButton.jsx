import { useSelector, useDispatch } from 'react-redux'
import { toggleBooking } from '../redux/vehicleSlice'
import { Calendar } from 'lucide-react'

export default function BookButton({ vehicle }) {
  const dispatch = useDispatch()
  const purchaseHistory = useSelector((state) => state.vehicle.purchaseHistory)

  const isBooked = purchaseHistory.some(item => item.vehicle === vehicle.vehicle)

  const handleToggleBooking = () => {
    dispatch(toggleBooking(vehicle))
  }

  return (
    <button 
      onClick={handleToggleBooking}
      className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
        isBooked 
          ? 'bg-red-600 text-white hover:bg-red-700' 
          : 'bg-blue-600 text-white hover:bg-blue-700'
      }`}
    >
      <Calendar className="w-4 h-4" />
      <span>
        {isBooked ? 'Cancel Booking' : 'Book Now'}
      </span>
    </button>
  )
}