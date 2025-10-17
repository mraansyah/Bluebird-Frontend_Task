import { describe, it, expect, beforeEach, vi } from "vitest"
import { configureStore } from "@reduxjs/toolkit"

let vehicleReducer
let toggleWishlist, toggleBooking, clearWishlist, clearPurchaseHistory, fetchVehicles

global.fetch = vi.fn()
global.localStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
  removeItem: vi.fn(),
}

const mockVehicle = {
  id: 1,
  name: "Toyota Avanza",
  vehicle: "toyota-avanza",
  price: 250000,
  location: "Jakarta",
  imageURL: "https://example.com/avanza.jpg",
}

const mockApiResponse = {
  category: ["SUV", "Sedan"],
  type: [
    {
      car_type: [
        { id: 1, name: "Toyota Avanza", vehicle: "toyota-avanza" },
        { id: 2, name: "Honda Jazz", vehicle: "honda-jazz" },
      ],
    },
  ],
}

describe("VehicleSlice", () => {
  let store

  beforeEach(async () => {
    vi.resetModules()
    vi.clearAllMocks()

    localStorage.getItem.mockImplementation(() => null)

    const sliceModule = await import("../redux/vehicleSlice")
    vehicleReducer = sliceModule.default
    toggleWishlist = sliceModule.toggleWishlist
    toggleBooking = sliceModule.toggleBooking
    clearWishlist = sliceModule.clearWishlist
    clearPurchaseHistory = sliceModule.clearPurchaseHistory
    fetchVehicles = sliceModule.fetchVehicles

    store = configureStore({
      reducer: { vehicle: vehicleReducer },
    })
  })

  describe("Initial State", () => {
    it("should have correct initial state", () => {
      const state = store.getState().vehicle

      expect(state.categories).toEqual([])
      expect(state.vehicles).toEqual([])
      expect(state.loading).toBe(false)
      expect(state.error).toBe(null)
      expect(state.wishlist).toEqual([])
      expect(state.purchaseHistory).toEqual([])
    })

    it("should load data from localStorage on initialization", async () => {
  const wishlistData = [mockVehicle]
  const purchaseData = [{ ...mockVehicle, purchaseDate: "2023-01-01T00:00:00.000Z" }]

  vi.resetModules()
  localStorage.getItem.mockImplementation((key) => {
    if (key === "wishlist") return JSON.stringify(wishlistData)
    if (key === "purchaseHistory") return JSON.stringify(purchaseData)
    return null
  })

  const sliceModule = await import("../redux/vehicleSlice")
  const reducer = sliceModule.default
  const newStore = configureStore({ reducer: { vehicle: reducer } })

  const state = newStore.getState().vehicle

  expect(state.wishlist).toEqual(wishlistData)
  expect(state.purchaseHistory).toEqual(purchaseData)
})


    it("should handle invalid localStorage data gracefully", async () => {
      localStorage.getItem.mockImplementation(() => "invalid-json")

      const { default: reducerAgain } = await import("../redux/vehicleSlice")
      const newStore = configureStore({ reducer: { vehicle: reducerAgain } })
      const state = newStore.getState().vehicle

      expect(state.wishlist).toEqual([])
      expect(state.purchaseHistory).toEqual([])
    })
  })

  describe("Wishlist Actions", () => {
    it("should add vehicle to wishlist", () => {
      store.dispatch(toggleWishlist(mockVehicle))

      const state = store.getState().vehicle
      expect(state.wishlist).toHaveLength(1)
      expect(state.wishlist[0]).toEqual(mockVehicle)
      expect(localStorage.setItem).toHaveBeenCalled()
    })

    it("should remove vehicle from wishlist when already present", () => {
      store.dispatch(toggleWishlist(mockVehicle))
      store.dispatch(toggleWishlist(mockVehicle))

      const state = store.getState().vehicle
      expect(state.wishlist).toHaveLength(0)
      expect(localStorage.setItem).toHaveBeenCalledTimes(2)
    })

    it("should clear wishlist", () => {
      store.dispatch(toggleWishlist(mockVehicle))
      store.dispatch(clearWishlist())

      const state = store.getState().vehicle
      expect(state.wishlist).toEqual([])
      expect(localStorage.setItem).toHaveBeenCalledWith("wishlist", JSON.stringify([]))
    })
  })

  describe("Booking Actions", () => {
    it("should add vehicle to purchase history", () => {
      store.dispatch(toggleBooking(mockVehicle))

      const state = store.getState().vehicle
      expect(state.purchaseHistory).toHaveLength(1)
      expect(state.purchaseHistory[0]).toMatchObject({
        ...mockVehicle,
        purchaseDate: expect.any(String),
      })
      expect(localStorage.setItem).toHaveBeenCalled()
    })

    it("should remove vehicle from purchase history when already present", () => {
      store.dispatch(toggleBooking(mockVehicle))
      store.dispatch(toggleBooking(mockVehicle))

      const state = store.getState().vehicle
      expect(state.purchaseHistory).toHaveLength(0)
      expect(localStorage.setItem).toHaveBeenCalledTimes(2)
    })

    it("should clear purchase history", () => {
      store.dispatch(toggleBooking(mockVehicle))
      store.dispatch(clearPurchaseHistory())

      const state = store.getState().vehicle
      expect(state.purchaseHistory).toEqual([])
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "purchaseHistory",
        JSON.stringify([])
      )
    })
  })

  describe("Async Actions", () => {
    beforeEach(() => {
      fetch.mockReset()
    })

    it("should handle fetchVehicles pending", () => {
      store.dispatch({ type: fetchVehicles.pending.type })

      const state = store.getState().vehicle
      expect(state.loading).toBe(true)
      expect(state.error).toBe(null)
    })

    it("should handle fetchVehicles fulfilled", () => {
      store.dispatch({
        type: fetchVehicles.fulfilled.type,
        payload: mockApiResponse,
      })

      const state = store.getState().vehicle
      expect(state.loading).toBe(false)
      expect(state.categories).toEqual(mockApiResponse.category)
      expect(state.vehicles).toHaveLength(2)
    })

    it("should handle fetchVehicles rejected", () => {
      const errorMessage = "Network error"
      store.dispatch({
        type: fetchVehicles.rejected.type,
        payload: errorMessage,
      })

      const state = store.getState().vehicle
      expect(state.loading).toBe(false)
      expect(state.error).toBe(errorMessage)
    })
  })

  describe("Edge Cases", () => {
    it("should handle multiple vehicles in wishlist", () => {
      const vehicle2 = { ...mockVehicle, id: 2, vehicle: "honda-jazz" }

      store.dispatch(toggleWishlist(mockVehicle))
      store.dispatch(toggleWishlist(vehicle2))

      const state = store.getState().vehicle
      expect(state.wishlist).toHaveLength(2)
    })

    it("should handle localStorage errors gracefully", () => {
      localStorage.setItem.mockImplementation(() => {
        throw new Error("Storage quota exceeded")
      })

      expect(() => store.dispatch(toggleWishlist(mockVehicle))).not.toThrow()
    })
  })
})
