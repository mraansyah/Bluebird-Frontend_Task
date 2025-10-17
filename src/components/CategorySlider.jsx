import React from 'react'
import { useSelector } from 'react-redux'


const getCategoryImage = (categoryName) => {
  const lowerName = categoryName.toLowerCase()
  
  if (lowerName.includes('car rental') || lowerName.includes('car')) {
    return 'https://www.bluebirdgroup.com/storage/armadaservicetype/67724b7ca3d8e.png'
  } else if (lowerName.includes('taxi')) {
    return 'https://www.bluebirdgroup.com/storage/armadaservicetype/67724b974f817.png'
  } else if (lowerName.includes('shuttle')) {
    return 'https://www.bluebirdgroup.com/storage/armadaservicetype/67724b9f173f4.png'
  } else if (lowerName.includes('bus')) {
    return 'https://www.bluebirdgroup.com/storage/armadaservicetype/67724bc6f1f7c.png'
  }
  
  return 'https://www.bluebirdgroup.com/storage/armadaservicetype/67724b7ca3d8e.png'
}


const getCategoryAlt = (categoryName) => {
  const lowerName = categoryName.toLowerCase()
  
  if (lowerName.includes('car rental') || lowerName.includes('car')) {
    return 'logo car rental'
  } else if (lowerName.includes('taxi')) {
    return 'logo taxi service'
  } else if (lowerName.includes('shuttle')) {
    return 'logo shuttle service'
  } else if (lowerName.includes('bus')) {
    return 'logo bus service'
  }
  
  return 'logo service'
}

export default function CategorySlider() {
  const categories = useSelector((state) => state.vehicle.categories)

  if (!categories.length) return null

  return (
    <section className="mt-6 text-center">
      <h2 className="text-xl font-semibold mb-4">Categories</h2>
      <div className="relative flex justify-center">
        <div
          className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-2 pb-3"
          style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}
        >
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="min-w-[120px] flex-shrink-0 snap-center bg-white shadow-md rounded-xl p-4 flex flex-col items-center transition-transform duration-300 hover:scale-105"
            >
              <img
                src={getCategoryImage(cat.name)}
                alt={getCategoryAlt(cat.name)}
                className="img-fit-cover mb-2"
                style={{ maxWidth: '127px' }}
              />
              <p className="font-medium text-gray-700">{cat.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
