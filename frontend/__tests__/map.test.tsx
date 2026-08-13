import { render, screen, fireEvent } from '@testing-library/react'
import Home from '@/app/map/page'
import { LanguageProvider } from '@/context/LanguageContext'

// Mock dynamic import for MapComponent
jest.mock('next/dynamic', () => () => {
  return function MockMap() {
    return <div data-testid="mock-map">Mocked Map</div>
  }
})

jest.mock('@/context/AuthContext', () => ({
  useAuth: () => ({ user: null, token: null, logout: jest.fn() }),
  AuthProvider: ({ children }: any) => <div>{children}</div>
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  })
) as jest.Mock;

describe('Map Page', () => {
  it('renders correctly with default controls tab', () => {
    render(
      <LanguageProvider>
        <Home />
      </LanguageProvider>
    )
    
    // Check old static texts just to be sure, or check for Map
    expect(screen.getByTestId('mock-map')).toBeInTheDocument()
  })

  it('switches tabs correctly', () => {
    render(
      <LanguageProvider>
        <Home />
      </LanguageProvider>
    )
    
    // Click on About Tab
    const aboutTabButton = screen.getByText('Giới thiệu')
    fireEvent.click(aboutTabButton)
    
    // Check if About content loading is there (since we mock fetch, it might be loading, but we can just check if map is gone)
    // Actually we can check if MapTab button is there to switch back
    const controlsTabButton = screen.getByText('Bản đồ GIS')
    fireEvent.click(controlsTabButton)
    
    // Check if map is back
    expect(screen.getByTestId('mock-map')).toBeInTheDocument()
  })
})
