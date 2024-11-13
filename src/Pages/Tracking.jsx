import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { MapIcon, Car } from 'lucide-react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const MAPBOX_TOKEN = 'pk.eyJ1Ijoic2FpcmFnaHUiLCJhIjoiY20wbTVibnFnMGI1dzJwczhiaGV1ZzRpNyJ9.bmz6PzeKxEIQSXCR7OxYXA';

const Tracking = () => {
  const {driverId} = useParams();

  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [coordinates, setCoordinates] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCoordinates = async () => {

    try {
      const driver_Id = driverId;
      const response = await axios.get(`http://localhost:8090/api/v1/user/getCordinates/${driver_Id}`);
      const data = response.data.location;
      
      if (data && !isNaN(data.latitude) && !isNaN(data.longitude)) {
        setCoordinates(data);
        setLoading(false);
        return data;
      } else {
        console.log(response.data);
        throw new Error('Invalid coordinates data');
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      setLoading(false);
    }
  };

  // Custom marker element using Lucide React Car icon
  const createCustomMarker = () => {
    const el = document.createElement('div');
    el.className = 'custom-marker';
    
    // Render Car icon using React
    const carIcon = document.createElement('div');
    carIcon.style.backgroundColor = '#3b82f6'; // blue-500
    carIcon.style.borderRadius = '50%';
    carIcon.style.padding = '8px';
    carIcon.style.display = 'flex';
    carIcon.style.alignItems = 'center';
    carIcon.style.justifyContent = 'center';
    
    // Create the car icon element
    const car = document.createElement('div');
    car.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-car"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L17 10h-1.1A5.5 5.5 0 0 0 10.2 5H8.8A5.5 5.5 0 0 0 3.1 10H2l-3.5 1.1C-2.2 11.3-3 12.1-3 13v3c0 .6.4 1 1 1h2a2 2 0 0 0 4 0h10a2 2 0 0 0 4 0Z"/></svg>`;
    
    carIcon.appendChild(car);
    el.appendChild(carIcon);
    
    return el;
  };

  useEffect(() => {
    mapboxgl.accessToken = MAPBOX_TOKEN;

    const initializeMap = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/satellite-streets-v11',
      center: [80.2785, 13.0878],
      zoom: 12, 
    });
  
    setMap(initializeMap);
    fetchCoordinates().then(initialCoords => {
      if (initialCoords) {
        const customMarker = createCustomMarker();
        const newMarker = new mapboxgl.Marker(customMarker)
          .setLngLat([initialCoords.longitude, initialCoords.latitude])
          .addTo(initializeMap);
        
        setMarker(newMarker);
        
        initializeMap.flyTo({
          center: [initialCoords.longitude, initialCoords.latitude],
          essential: true
        });
      }
    });

    return () => initializeMap.remove();
  }, []);

  useEffect(() => {
    let intervalId;
  
    if (map) {
      // Start polling after initial load
      intervalId = setInterval(async () => {
        const newCoordinates = await fetchCoordinates();
        
        if (newCoordinates) {
          if (newCoordinates.latitude && newCoordinates.longitude && 
              !isNaN(newCoordinates.latitude) && !isNaN(newCoordinates.longitude)) {
            
            if (marker) {
              marker.setLngLat([newCoordinates.longitude, newCoordinates.latitude]);
            }
  
            map.flyTo({
              center: [newCoordinates.longitude, newCoordinates.latitude],
              essential: true
            });
          } else {
            console.error("Invalid coordinates:", newCoordinates);
          }
        }
      }, 10000);
    }
  
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [map, marker]);

  return (
    <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapIcon className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">Live Tracking Map</h2>
          </div>
          {coordinates && (
            <div className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
              {Number(coordinates.latitude).toFixed(6)}, {Number(coordinates.longitude).toFixed(6)}
            </div>
          )}
        </div>
      </div>

      <div className="relative">
        <div 
          id="map" 
          className="w-full h-96"
        />
        
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      <div className="p-4 bg-gray-50">
        <div className="text-sm text-gray-600">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default Tracking;