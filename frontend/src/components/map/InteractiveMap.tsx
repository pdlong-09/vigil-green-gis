"use client";

import React, { useMemo } from 'react';
import Map, { Source, Layer, NavigationControl } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

interface InteractiveMapProps {
  geojsonUrl?: string;
}

export default function InteractiveMap({ geojsonUrl = '/data/mock-risks.geojson' }: InteractiveMapProps) {
  
  // Style for the polygon fill
  const fillLayerStyle = useMemo(() => ({
    id: 'risk-data-fill',
    type: 'fill' as const,
    paint: {
      'fill-color': [
        'match',
        ['get', 'risk_level'],
        'high', '#ef4444',   // red-500
        'medium', '#f97316', // orange-500
        'low', '#22c55e',    // green-500
        '#888888'            // fallback
      ],
      'fill-opacity': 0.5
    }
  } as any), []);

  // Style for the polygon outline
  const lineLayerStyle = useMemo(() => ({
    id: 'risk-data-line',
    type: 'line' as const,
    paint: {
      'line-color': [
        'match',
        ['get', 'risk_level'],
        'high', '#991b1b',   // red-800
        'medium', '#9a3412', // orange-800
        'low', '#166534',    // green-800
        '#444444'            // fallback
      ],
      'line-width': 2
    }
  } as any), []);

  return (
    <div className="w-full h-full relative rounded-2xl overflow-hidden shadow-lg border border-gray-200">
      <Map
        initialViewState={{
          longitude: 108.0,
          latitude: 14.0,
          zoom: 6
        }}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        interactive={true}
      >
        <NavigationControl position="top-right" />
        
        <Source id="risk-data" type="geojson" data={geojsonUrl}>
          <Layer {...fillLayerStyle} />
          <Layer {...lineLayerStyle} />
        </Source>
      </Map>
    </div>
  );
}
