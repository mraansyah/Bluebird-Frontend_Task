import { render, screen, waitFor } from "@testing-library/react"
import { Provider } from "react-redux"
import { BrowserRouter } from "react-router-dom"
import { configureStore } from "@reduxjs/toolkit"
import { describe, it, expect, vi, beforeEach } from "vitest"
import vehicleReducer from "../redux/vehicleSlice"
import VehicleDetailPage from "../pages/VehicleDetailPage"

// Mock react-router-dom
let mockNavigate
let mockUseParams

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom")
  return {
    ...actual,
    useParams: () => mockUseParams(),
    useNavigate: () => mockNavigate,
  }
})

// Mock vehicle data
const mockVehicle = {
  id: 1,
  name: "Toyota Avanza",
  vehicle: "toyota-avanza",
  price: 250000,
  location: "Jakarta",
  imageURL: "https://example.com/avanza.jpg",
  capacity: 7,
  fuelType: "Gasoline",
  year: 2023,
  transmission: "Manual",
  description: "Reliable car",
  features: ["AC", "Power Steering", "ABS"],
}

// Create mock store
const createMockStore = (initialState = {}) =>
  configureStore({
    reducer: { vehicle: vehicleReducer },
    preloadedState: {
      vehicle: {
        vehicles: [mockVehicle],
        categories: [],
        loading: false,
        error: null,
        wishlist: [],
        purchaseHistory: [],
        ...initialState,
      },
    },
  })

describe("VehicleDetailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockNavigate = vi.fn()
    mockUseParams = vi.fn().mockReturnValue({ vehicleName: "toyota-avanza" })
  })

  const renderWithStore = (store) =>
    render(
      <Provider store={store}>
        <BrowserRouter>
          <VehicleDetailPage />
        </BrowserRouter>
      </Provider>
    )

  it("shows loading state when vehicles are loading", () => {
    const store = createMockStore({ loading: true })
    renderWithStore(store)

    const loadingText = screen.queryByText((c) =>
      /memuat kendaraan/i.test(c)
    )
    const statusRole = screen.queryByRole("status")

    expect(loadingText || statusRole).toBeTruthy()
  })

  it("renders vehicle details when found", async () => {
    const store = createMockStore()
    renderWithStore(store)

    await waitFor(() => {
      expect(screen.getByText((c) => c.includes(mockVehicle.name))).toBeInTheDocument()
      expect(screen.getByText((c) => c.includes(mockVehicle.location))).toBeInTheDocument()
      expect(screen.getByText((c) => c.includes(String(mockVehicle.price)))).toBeInTheDocument()
    })
  })

  it("renders vehicle specifications", async () => {
    const store = createMockStore()
    renderWithStore(store)

    await waitFor(() => {
      expect(screen.getByText(/7/i)).toBeInTheDocument()
      expect(screen.getByText(/Gasoline/i)).toBeInTheDocument()
      expect(screen.getByText(/2023/i)).toBeInTheDocument()
      expect(screen.getByText(/Manual/i)).toBeInTheDocument()
    })
  })

  it("renders vehicle features", async () => {
    const store = createMockStore()
    renderWithStore(store)

    await waitFor(() => {
      mockVehicle.features.forEach((feature) => {
        expect(screen.getByText(new RegExp(feature, "i"))).toBeInTheDocument()
      })
    })
  })

  it("shows not found message for invalid vehicle", async () => {
    mockUseParams.mockReturnValue({ vehicleName: "non-existing-vehicle" })
    const store = createMockStore({ vehicles: [] })
    renderWithStore(store)

    await waitFor(() => {
      const notFoundText = screen.queryByText((c) =>
        /tidak.*ditemukan|vehicle.*not.*found/i.test(c)
      )
      expect(notFoundText).toBeTruthy()
    })
  })

  it("renders vehicle image with correct attributes", async () => {
  const store = createMockStore()
  renderWithStore(store)

  await waitFor(() => {
    
    const vehicleImage = screen.getByAltText(/toyota[- ]?avanza/i)
    expect(vehicleImage).toBeInTheDocument()
    expect(vehicleImage).toHaveAttribute("src", mockVehicle.imageURL)
    })
  })
})
