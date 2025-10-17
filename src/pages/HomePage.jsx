import React, {useEffect} from 'react'
import { useDispatch } from 'react-redux'
import {fetchVehicles} from '../redux/vehicleSlice'
import Navbar from '../components/Navbar'
import CategorySlider from '../components/CategorySlider'
import VehicleList from '../components/VechileList'
import Footer from '../components/Footer'

function Home() {
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(fetchVehicles())
  }, [dispatch])

  return (
    <div>
        <Navbar/>
        <main className="mt-16 p-4 max-w-6xl mx-auto">
            <CategorySlider/>
            <VehicleList/>
        </main>
        <Footer/>
    </div>
  )
}

export default Home