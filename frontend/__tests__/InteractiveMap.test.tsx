import React from 'react';
import { render, screen } from '@testing-library/react';
import InteractiveMap from '@/components/map/InteractiveMap';

// Mock react-map-gl/maplibre as it uses WebGL which is not supported in jsdom
jest.mock('react-map-gl/maplibre', () => {
  const MapMock = ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-map">
      {children}
    </div>
  );
  
  const SourceMock = ({ children, id, data }: { children: React.ReactNode, id: string, data: any }) => (
    <div data-testid={`mock-source-${id}`} data-source-data={data}>
      {children}
    </div>
  );
  
  const LayerMock = ({ id }: { id: string }) => (
    <div data-testid={`mock-layer-${id}`} />
  );

  const NavigationControlMock = () => (
    <div data-testid="mock-nav-control" />
  );

  return {
    __esModule: true,
    default: MapMock,
    Source: SourceMock,
    Layer: LayerMock,
    NavigationControl: NavigationControlMock
  };
});

describe('InteractiveMap', () => {
  it('renders the map and controls', () => {
    render(<InteractiveMap />);
    
    // Check if the mock map is rendered
    expect(screen.getByTestId('mock-map')).toBeInTheDocument();
    
    // Check if the navigation control is rendered
    expect(screen.getByTestId('mock-nav-control')).toBeInTheDocument();
  });

  it('renders the GeoJSON source and layers', () => {
    render(<InteractiveMap geojsonUrl="/test-data.geojson" />);
    
    // Check if the source is rendered with the correct url
    const source = screen.getByTestId('mock-source-risk-data');
    expect(source).toBeInTheDocument();
    expect(source.getAttribute('data-source-data')).toBe('/test-data.geojson');
    
    // Check if layers are rendered inside the source
    expect(screen.getByTestId('mock-layer-risk-data-fill')).toBeInTheDocument();
    expect(screen.getByTestId('mock-layer-risk-data-line')).toBeInTheDocument();
  });
});
