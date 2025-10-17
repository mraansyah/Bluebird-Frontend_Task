import { render, screen, fireEvent } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import { describe, it, expect } from "vitest"
import Navbar from "../components/Navbar"

describe("Navbar", () => {
  const renderWithRouter = (ui) =>
    render(
      <BrowserRouter>
        {ui}
      </BrowserRouter>
    )

  it("renders navigation links", () => {
    renderWithRouter(<Navbar />)
    
    expect(screen.getByText("Home")).toBeInTheDocument()
    expect(screen.getByText("Wishlist")).toBeInTheDocument()
    expect(screen.getByText("MyBook")).toBeInTheDocument() 
  })

  it("renders logo/brand name", () => {
    renderWithRouter(<Navbar />)
    expect(screen.getByText("Bluebird")).toBeInTheDocument()
  })

  it("renders search button", () => {
    renderWithRouter(<Navbar />)
    
    const searchButton = screen.getByRole("button")
    expect(searchButton).toBeInTheDocument()
  })

  it("shows search input when search button is clicked", () => {
    renderWithRouter(<Navbar />)
    
    const searchButton = screen.getByRole("button")
    fireEvent.click(searchButton)
    
    expect(screen.getByPlaceholderText("Search vehicle...")).toBeInTheDocument()
  })

  it("has correct navigation structure", () => {
    renderWithRouter(<Navbar />)
    expect(screen.getByRole("navigation")).toBeInTheDocument()
  })

  it("navigates to correct pages", () => {
    renderWithRouter(<Navbar />)
    
    const homeLink = screen.getByText("Home").closest("a")
    const wishlistLink = screen.getByText("Wishlist").closest("a")
    const myBookLink = screen.getByText("MyBook").closest("a")
    
    expect(homeLink).toHaveAttribute("href", "/")
    expect(wishlistLink).toHaveAttribute("href", "/wishlist")
    expect(myBookLink).toHaveAttribute("href", "/mybook")
  })

  it("handles search functionality", () => {
    renderWithRouter(<Navbar />)
    
    const searchButton = screen.getByRole("button")
    fireEvent.click(searchButton)
    
    const searchInput = screen.getByPlaceholderText("Search vehicle...")
    fireEvent.change(searchInput, { target: { value: "Toyota" } })
    
    expect(searchInput).toHaveValue("Toyota")
  })

  it("closes search when escape key is pressed", () => {
    renderWithRouter(<Navbar />)
    
    const searchButton = screen.getByRole("button")
    fireEvent.click(searchButton)
    
    expect(screen.getByPlaceholderText("Search vehicle...")).toBeInTheDocument()
    
    const searchInput = screen.getByPlaceholderText("Search vehicle...")
    fireEvent.keyDown(searchInput, { key: "Escape" })
    
    expect(screen.queryByPlaceholderText("Search vehicle...")).not.toBeInTheDocument()
  })
})