import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { Provider } from "react-redux"
import { BrowserRouter } from "react-router-dom"
import { configureStore } from "@reduxjs/toolkit"
import { describe, it, expect, vi, beforeEach } from "vitest"
import SearchPage from "../pages/SearchPage"
import vehicleReducer from "../redux/vehicleSlice"

const mockFetch = vi.fn()
global.fetch = mockFetch

const mockNavigate = vi.fn()
let mockLocation = { search: "?query=toyota" }

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom")
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation,
  }
})

const mockApiResponse = {
  type: [
    {
      car_type: [
        {
          id: 1,
          vehicle: "toyota-avanza",
          name: "Toyota Avanza",
          price: 250000,
          location: "Jakarta",
          imageURL: "https://example.com/avanza.jpg",
          description: ["Reliable car", "Good fuel economy"]
        },
        {
          id: 2,
          vehicle: "honda-jazz",
          name: "Honda Jazz",
          price: 300000,
          location: "Bandung",
          imageURL: "https://example.com/jazz.jpg",
          description: ["Compact car", "Easy to park"]
        }
      ]
    }
  ]
}

const createStore = (initialState = {}) =>
  configureStore({
    reducer: { vehicle: vehicleReducer },
    preloadedState: {
      vehicle: {
        vehicles: [],
        categories: [],
        loading: false,
        error: null,
        wishlist: [],
        purchaseHistory: [],
        ...initialState,
      },
    },
  })

const renderWithStore = (store) =>
  render(
    <Provider store={store}>
      <BrowserRouter>
        <SearchPage />
      </BrowserRouter>
    </Provider>
  )

describe("SearchPage", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockApiResponse),
    })
    mockLocation = { search: "?query=toyota" }
  })

  it("renders page title and query", async () => {
    const store = createStore()
    renderWithStore(store)

    await waitFor(() => {
      expect(screen.getByText("Hasil Pencarian")).toBeInTheDocument()
      expect(screen.getByText('Menampilkan hasil untuk "toyota"')).toBeInTheDocument()
    })
  })

  it("displays only filtered vehicles by query", async () => {
    const store = createStore()
    renderWithStore(store)

    await waitFor(() => {
      expect(screen.getByText("toyota-avanza")).toBeInTheDocument()
      expect(screen.queryByText("honda-jazz")).not.toBeInTheDocument()
      expect(screen.getByText("250000")).toBeInTheDocument()
    })
  })

  it("displays all vehicles when no query filtering", async () => {
    // Simulate empty query
    mockLocation = { search: "" }
    const store = createStore()
    renderWithStore(store)

    await waitFor(() => {
      expect(screen.getByText("toyota-avanza")).toBeInTheDocument()
      expect(screen.getByText("honda-jazz")).toBeInTheDocument()
      expect(screen.getByText("250000")).toBeInTheDocument()
      expect(screen.getByText("300000")).toBeInTheDocument()
    })
  })

  it("renders vehicle images with correct alt and src", async () => {
    mockLocation = { search: "" } // show all vehicles
    const store = createStore()
    renderWithStore(store)

    await waitFor(() => {
      const toyotaImg = screen.getByAltText("toyota-avanza")
      const hondaImg = screen.getByAltText("honda-jazz")

      expect(toyotaImg).toHaveAttribute("src", "https://example.com/avanza.jpg")
      expect(hondaImg).toHaveAttribute("src", "https://example.com/jazz.jpg")
    })
  })

  it("renders vehicle descriptions from array", async () => {
    mockLocation = { search: "" } // show all vehicles
    const store = createStore()
    renderWithStore(store)

    await waitFor(() => {
      const items = screen.getAllByRole("listitem")
      const descriptions = items.map((li) => li.textContent)
      expect(descriptions).toEqual(
        expect.arrayContaining([
          "Reliable car",
          "Good fuel economy",
          "Compact car",
          "Easy to park",
        ])
      )
    })
  })

  it("navigates to vehicle detail on button click", async () => {
    const store = createStore()
    renderWithStore(store)

    await waitFor(() => {
      expect(screen.getByText("toyota-avanza")).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText("Lihat Detail"))
    expect(mockNavigate).toHaveBeenCalledWith("/vehicle/toyota-avanza")
  })

  it("shows loading state initially", () => {
    const store = createStore({ loading: true })
    renderWithStore(store)
    expect(screen.getByText("Memuat kendaraan...")).toBeInTheDocument()
  })

  it("shows error state when fetch fails", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"))
    const store = createStore()
    renderWithStore(store)

    await waitFor(() => {
      expect(screen.getByText("Gagal memuat data")).toBeInTheDocument()
    })
  })
})
