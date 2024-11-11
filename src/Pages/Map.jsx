import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MapboxRouting = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize map
  useEffect(() => {
    if (map.current) return;

    // Replace with your Mapbox access token
    mapboxgl.accessToken = 'pk.eyJ1Ijoic2FpcmFnaHUiLCJhIjoiY20wbTVibnFnMGI1dzJwczhiaGV1ZzRpNyJ9.bmz6PzeKxEIQSXCR7OxYXA';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-74.5, 40], // Default center
      zoom: 9
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl());

    return () => map.current?.remove();
  }, []);

  // Function to get coordinates from address using Mapbox Geocoding API
  const getCoordinates = async (address) => {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapboxgl.accessToken}`
    );
    const data = await response.json();
    if (data.features.length === 0) throw new Error(`No results found for ${address}`);
    return data.features[0].center;
  };

  // Function to draw route between two points
  const drawRoute = async (sourceCoords, destCoords) => {
    const response = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${sourceCoords[0]},${sourceCoords[1]};${destCoords[0]},${destCoords[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}`
    );
    const data = await response.json();

    if (data.code !== 'Ok') throw new Error('Unable to find route');

    // Remove existing route layer and source
    if (map.current.getSource('route')) {
      map.current.removeLayer('route');
      map.current.removeSource('route');
    }

    // Add route to map
    map.current.addSource('route', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: data.routes[0].geometry
      }
    });

    map.current.addLayer({
      id: 'route',
      type: 'line',
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#3b82f6',
        'line-width': 4
      }
    });

    // Fit bounds to show the entire route
    const coordinates = data.routes[0].geometry.coordinates;
    const bounds = coordinates.reduce((bounds, coord) => {
      return bounds.extend(coord);
    }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

    map.current.fitBounds(bounds, {
      padding: 50
    });

    return data.routes[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Get coordinates for both addresses
      const sourceCoords = await getCoordinates(source);
      const destCoords = await getCoordinates(destination);

      // Add markers
      const markers = document.getElementsByClassName('marker');
      while (markers[0]) {
        markers[0].remove();
      }

      // Add source marker
      new mapboxgl.Marker({ color: '#22c55e' })
        .setLngLat(sourceCoords)
        .addTo(map.current);

      // Add destination marker
      new mapboxgl.Marker({ color: '#ef4444' })
        .setLngLat(destCoords)
        .addTo(map.current);

      // Draw route
      const route = await drawRoute(sourceCoords, destCoords);

      // Add distance and duration info
      const distance = (route.distance / 1000).toFixed(1);
      const duration = Math.round(route.duration / 60);

      setError(`Distance: ${distance} km, Duration: ${duration} minutes`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4 mb-4">
          <div className="space-y-4">
            <div>
              <label htmlFor="source" className="block text-sm font-medium text-gray-700">
                Source
              </label>
              <input
                type="text"
                id="source"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md 
                         shadow-sm focus:outline-none focus:ring-blue-500 
                         focus:border-blue-500"
                placeholder="Enter source address"
                required
              />
            </div>

            <div>
              <label htmlFor="destination" className="block text-sm font-medium text-gray-700">
                Destination
              </label>
              <input
                type="text"
                id="destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md 
                         shadow-sm focus:outline-none focus:ring-blue-500 
                         focus:border-blue-500"
                placeholder="Enter destination address"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent 
                     rounded-md shadow-sm text-sm font-medium text-white 
                     bg-blue-600 hover:bg-blue-700 focus:outline-none 
                     focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
                     disabled:opacity-50"
          >
            {loading ? 'Finding Route...' : 'Show Route'}
          </button>
        </form>

        {error && (
          <div className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-400 text-blue-700">
            {error}
          </div>
        )}

        <div 
          ref={mapContainer} 
          className="w-full h-96 rounded-lg overflow-hidden"
        />
      </div>
    </div>
  );
};

export default MapboxRouting;











