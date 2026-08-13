import { render, screen, waitFor } from '@testing-library/react'
import AboutTab from '@/components/AboutTab'

jest.mock('@/context/AuthContext', () => ({
  useAuth: () => ({ user: null, token: null, logout: jest.fn() })
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({
      vi: {
        aboutProject: "Về dự án",
        dataSources: "Nguồn dữ liệu",
        guide: "Hướng dẫn"
      }
    }),
  })
) as jest.Mock;

describe('AboutTab', () => {
  it('renders all sections correctly', async () => {
    render(<AboutTab />)
    
    // Check if the main heading exists after loading
    await waitFor(() => {
      expect(screen.getByText('Về dự án')).toBeInTheDocument()
    })
    
    // Check if Data Sources section exists
    expect(screen.getByText('Nguồn dữ liệu')).toBeInTheDocument()
    
    // Check if Usage Instructions exists
    expect(screen.getByText('Hướng dẫn')).toBeInTheDocument()
  })
})
