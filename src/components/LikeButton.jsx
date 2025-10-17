import { Heart } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { toggleWishlist } from '../redux/vehicleSlice'

export default function LikeButton({ vehicle, id }) {
  const dispatch = useDispatch()
  const wishlist = useSelector((state) => state.vehicle.wishlist)
  

  const vehicleObj = vehicle || { vehicle: id }
  const vehicleKey = vehicleObj.vehicle || id
  
  const isLiked = wishlist.some(item => item.vehicle === vehicleKey)

  const handleToggleLike = () => {
    
    if (vehicle) {
      dispatch(toggleWishlist(vehicle))
    } else {
      
      dispatch(toggleWishlist({ vehicle: id }))
    }
  }

  return (
    <button 
      onClick={handleToggleLike} 
      aria-label={isLiked ? "Remove from wishlist" : "Add to wishlist"}
      className="p-2 rounded-full hover:bg-gray-100 transition-colors"
    >
      <Heart
        className={`w-6 h-6 ${
          isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'
        } transition-colors`}
      />
    </button>
  )
}