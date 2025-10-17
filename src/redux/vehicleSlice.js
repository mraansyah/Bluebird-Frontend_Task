import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = 'https://private-f2fbfb-ridecar2.apiary-mock.com/vehicles'

const safeGetFromStorage = (key, defaultValue = []) => {
  if (typeof window === 'undefined') return defaultValue
  
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch {
    return defaultValue
  }
}

const safeSaveToStorage = (key, value) => {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.warn(`Failed to save to localStorage: ${error.message}`)
  }
}

export const fetchVehicles = createAsyncThunk(
  'vehicles/fetchVehicles',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL)
      if (!response.ok) throw new Error('Failed to fetch vehicles')
      return await response.json()
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const initialState = {
  categories: [],
  vehicles: [],
  loading: false,
  error: null,
  wishlist: safeGetFromStorage('wishlist'),
  purchaseHistory: safeGetFromStorage('purchaseHistory'),
}

const vehicleSlice = createSlice({
  name: 'vehicles',
  initialState,
  reducers: {
    toggleWishlist: (state, { payload: vehicle }) => {
      const existingIndex = state.wishlist.findIndex(
        item => item.vehicle === vehicle.vehicle
      )

      if (existingIndex >= 0) {
        state.wishlist.splice(existingIndex, 1)
      } else {
        state.wishlist.push(vehicle)
      }

      safeSaveToStorage('wishlist', state.wishlist)
    },

    toggleBooking: (state, { payload: vehicle }) => {
      const existingIndex = state.purchaseHistory.findIndex(
        item => item.vehicle === vehicle.vehicle
      )

      if (existingIndex >= 0) {
        state.purchaseHistory.splice(existingIndex, 1)
      } else {
        const bookingEntry = {
          ...vehicle,
          purchaseDate: new Date().toISOString(),
        }
        state.purchaseHistory.push(bookingEntry)
      }

      safeSaveToStorage('purchaseHistory', state.purchaseHistory)
    },

    clearWishlist: (state) => {
      state.wishlist = []
      safeSaveToStorage('wishlist', [])
    },

    clearPurchaseHistory: (state) => {
      state.purchaseHistory = []
      safeSaveToStorage('purchaseHistory', [])
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVehicles.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchVehicles.fulfilled, (state, { payload }) => {
        state.loading = false
        state.categories = payload.category || []
        state.vehicles = payload.type?.flatMap((t) => t.car_type) || []
        state.error = null
      })
      .addCase(fetchVehicles.rejected, (state, { payload }) => {
        state.loading = false
        state.error = payload
      })
  },
})

export const { 
  toggleWishlist, 
  toggleBooking, 
  clearWishlist, 
  clearPurchaseHistory 
} = vehicleSlice.actions

export default vehicleSlice.reducer