"use client";

import React, { useEffect, useRef, useState } from 'react';
import { X, Check, MapPin, Navigation, Compass, Search, Crosshair } from 'lucide-react';

// Narsipatnam default center (Near Abes Centre / Main Road)
const DEFAULT_CENTER = { lat: 17.66635, lng: 82.61015 };

const NARSIPATNAM_GRID = [
  { name: "Abes Centre (Main Road)", lat: 17.66635, lng: 82.61015, area: "Abes Centre", street: "Main Road", landmark: "Beside Himalaya Juice Center" },
  { name: "Tagarapu Veedhi", lat: 17.6675, lng: 82.6115, area: "Tagarapu Veedhi", street: "Tagarapu Veedhi", landmark: "Behind Municipal Office" },
  { name: "RTC Bus Stand & Complex", lat: 17.6710, lng: 82.6150, area: "RTC Complex Area", street: "RTC Complex Road", landmark: "Near RTC Main Entrance" },
  { name: "Area Hospital & DSP Office", lat: 17.6625, lng: 82.6130, area: "Area Hospital Road", street: "Hospital Road", landmark: "Near Area Hospital" },
  { name: "Balighattam & Sai Baba Temple", lat: 17.6540, lng: 82.6030, area: "Balighattam", street: "Balighattam Road", landmark: "Near Shirdi Sai Baba Temple" },
  { name: "Govt Degree & Junior College", lat: 17.6740, lng: 82.6080, area: "College Road", street: "College Road", landmark: "Near Govt Degree College" },
  { name: "Peddaboddepalli", lat: 17.6820, lng: 82.6200, area: "Peddaboddepalli", street: "Boddepalli Main Road", landmark: "Near Boddepalli Centre" },
  { name: "Ayyannapalem", lat: 17.6660, lng: 82.6090, area: "Ayyannapalem", street: "Ayyannapalem Road", landmark: "Near Subhash Statue Junction" },
  { name: "NTR Stadium & Municipal Office", lat: 17.6650, lng: 82.6120, area: "NTR Stadium Area", street: "Municipality Road", landmark: "Near NTR Stadium Gate" },
  { name: "Shanti Nagar & Housing Board", lat: 17.6690, lng: 82.6050, area: "Shanti Nagar", street: "Housing Board Colony Road", landmark: "Near Housing Board Colony" },
  { name: "Lingarajupeta", lat: 17.6590, lng: 82.6180, area: "Lingarajupeta", street: "Lingarajupeta Road", landmark: "Near Primary School" },
  { name: "Cinema Road & Sri Kanya Theatre", lat: 17.6680, lng: 82.6140, area: "Cinema Road", street: "Cinema Road", landmark: "Near Sri Kanya Theatre" },
  { name: "Gandhi Park & Old Post Office", lat: 17.6670, lng: 82.6105, area: "Gandhi Park Area", street: "Main Road", landmark: "Near Gandhi Park" },
  { name: "Court Complex & Sub-Jail", lat: 17.6635, lng: 82.6080, area: "Court Complex Area", street: "Court Road", landmark: "Near Sub-Collector Office" },
  { name: "Saraswathi Nagar", lat: 17.6720, lng: 82.6120, area: "Saraswathi Nagar", street: "Saraswathi Nagar Road", landmark: "Near Saraswathi Temple" },
  { name: "Sundaraiah Nagar", lat: 17.6750, lng: 82.6170, area: "Sundaraiah Nagar", street: "Sundaraiah Nagar Road", landmark: "Near Community Hall" },
  { name: "Bapuji Nagar", lat: 17.6685, lng: 82.6070, area: "Bapuji Nagar", street: "Bapuji Nagar Road", landmark: "Near Bapuji Park" },
  { name: "Teachers Colony", lat: 17.6715, lng: 82.6060, area: "Teachers Colony", street: "Teachers Colony Road", landmark: "Near Teachers Colony Hall" },
  { name: "Venkatanagaram", lat: 17.6640, lng: 82.6160, area: "Venkatanagaram", street: "Venkatanagaram Road", landmark: "Near Venkatanagaram Centre" },
  { name: "Neelampeta", lat: 17.6610, lng: 82.6060, area: "Neelampeta", street: "Neelampeta Road", landmark: "Near Neelampeta Junction" },
  { name: "Dharmavaram", lat: 17.6760, lng: 82.6250, area: "Dharmavaram", street: "Kotauratla Road", landmark: "Near Bypass Junction" },
  { name: "Komatipalem", lat: 17.6615, lng: 82.6210, area: "Komatipalem", street: "Komatipalem Veedhi", landmark: "Near Komatipalem Centre" },
  { name: "Pedagollapalle", lat: 17.6580, lng: 82.6230, area: "Pedagollapalle", street: "Pedagollapalle Road", landmark: "Near Primary School" },
  { name: "Chinagollapalle", lat: 17.6550, lng: 82.6260, area: "Chinagollapalle", street: "Chinagollapalle Road", landmark: "Near Chinagollapalle Centre" },
  { name: "Vemulapudi Road", lat: 17.6690, lng: 82.6220, area: "Vemulapudi Road Area", street: "Vemulapudi Road", landmark: "Near Bypass Bridge" },
  { name: "Burugupalem", lat: 17.6880, lng: 82.6120, area: "Burugupalem", street: "Burugupalem Road", landmark: "Near Burugupalem Centre" }
];

function resolveLocalColony(lat, lng) {
  let closest = NARSIPATNAM_GRID[0];
  let minDist = 99999;
  for (const c of NARSIPATNAM_GRID) {
    const dLat = (lat - c.lat);
    const dLng = (lng - c.lng);
    const distSq = dLat * dLat + dLng * dLng;
    if (distSq < minDist) {
      minDist = distSq;
      closest = c;
    }
  }
  const streetPart = closest.street && closest.street !== closest.area ? `${closest.street}, ` : '';
  return {
    ...closest,
    formatted: `${streetPart}${closest.area}, Narsipatnam - 531116`,
    shortText: `${closest.area}, Narsipatnam`
  };
}

const QUICK_COLONIES = [
  { name: "📍 Tagarapu Veedhi", lat: 17.6675, lng: 82.6115 },
  { name: "🛍️ Abes Centre / Main Rd", lat: 17.66635, lng: 82.61015 },
  { name: "🏢 RTC Complex", lat: 17.6710, lng: 82.6150 },
  { name: "🏘️ Ayyannapalem", lat: 17.6660, lng: 82.6090 },
  { name: "🏥 Area Hospital", lat: 17.6625, lng: 82.6130 },
  { name: "🛕 Sai Baba Temple", lat: 17.6540, lng: 82.6030 },
  { name: "🎓 College Road", lat: 17.6740, lng: 82.6080 },
  { name: "🏘️ Peddaboddepalli", lat: 17.6820, lng: 82.6200 },
  { name: "🏡 Shanti Nagar", lat: 17.6690, lng: 82.6050 },
  { name: "🌿 Balighattam", lat: 17.6580, lng: 82.6050 }
];

export default function LocationPickerModal({
  isOpen,
  onClose,
  initialCoords,
  onSelectLocation
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  const [currentCoords, setCurrentCoords] = useState(initialCoords || DEFAULT_CENTER);
  const [addressPreview, setAddressPreview] = useState('Fetching exact address...');
  const [plusCodePreview, setPlusCodePreview] = useState('');
  const [distanceInfo, setDistanceInfo] = useState('');
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLocatingUser, setIsLocatingUser] = useState(false);

  // Fetch address whenever coords change - ALWAYS IN ACCURATE WORDS
  const fetchAddressForCoords = async (lat, lng) => {
    // 1. Instantly resolve closest colony from high-accuracy local grid (Zero latency guarantee)
    const localFallback = resolveLocalColony(lat, lng);
    setAddressPreview(localFallback.formatted);

    setIsLoadingAddress(true);
    try {
      const res = await fetch(`/api/geocode?lat=${lat}&lng=${lng}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.wordsAddress && data.wordsAddress !== 'Andhra Pradesh' && !data.wordsAddress.includes('Andhra Pradesh, Andhra Pradesh')) {
          const cleanDisplay = data.wordsAddress || data.address || localFallback.formatted;
          setAddressPreview(cleanDisplay);
          if (data.plusCode) setPlusCodePreview(data.plusCode);
          setDistanceInfo(`~${data.distanceKm} km from shop • ${data.estimatedTime || '20-30 mins'}`);
          return data;
        }
      }
    } catch (e) {
      console.warn('Map geocode error:', e);
    } finally {
      setIsLoadingAddress(false);
    }

    return {
      success: true,
      address: localFallback.formatted,
      wordsAddress: localFallback.formatted,
      area: localFallback.area,
      street: localFallback.street,
      landmark: localFallback.landmark,
      pincode: '531116',
      distanceKm: 1.5,
      estimatedTime: '20-25 mins'
    };
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!isOpen || typeof window === 'undefined') return;

    let isMounted = true;

    // Dynamically load Leaflet to avoid SSR issues
    import('leaflet').then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      // Clean up previous instance if any
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const initialLat = (initialCoords && initialCoords.lat) || DEFAULT_CENTER.lat;
      const initialLng = (initialCoords && initialCoords.lng) || DEFAULT_CENTER.lng;
      setCurrentCoords({ lat: initialLat, lng: initialLng });

      // Create map
      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: 16,
        zoomControl: false
      });

      L.control.zoom({ position: 'topright' }).addTo(map);

      // OpenStreetMap standard tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(map);

      // Custom Red Pin icon
      const customIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div style="
            position: relative;
            transform: translate(-50%, -100%);
            display: flex;
            flex-direction: column;
            align-items: center;
          ">
            <div style="
              background: #ea580c;
              color: white;
              padding: 4px 8px;
              border-radius: 999px;
              font-size: 11px;
              font-weight: 800;
              box-shadow: 0 4px 10px rgba(0,0,0,0.3);
              white-space: nowrap;
              margin-bottom: 2px;
              border: 2px solid white;
            ">
              📍 Exact Delivery Spot
            </div>
            <div style="
              width: 22px;
              height: 22px;
              background: #ea580c;
              border: 3px solid white;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              box-shadow: 0 4px 10px rgba(0,0,0,0.35);
            "></div>
          </div>
        `,
        iconSize: [30, 42],
        iconAnchor: [15, 42]
      });

      // Add draggable marker
      const marker = L.marker([initialLat, initialLng], {
        draggable: true,
        icon: customIcon
      }).addTo(map);

      // Update position on marker drag
      marker.on('dragend', () => {
        const pos = marker.getLatLng();
        setCurrentCoords({ lat: pos.lat, lng: pos.lng });
        fetchAddressForCoords(pos.lat, pos.lng);
      });

      // Update position on map click
      map.on('click', (e) => {
        marker.setLatLng(e.latlng);
        setCurrentCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
        fetchAddressForCoords(e.latlng.lat, e.latlng.lng);
      });

      mapInstanceRef.current = map;
      markerRef.current = marker;

      // Initial address fetch
      fetchAddressForCoords(initialLat, initialLng);
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isOpen]);

  // Handle GPS Auto-detect button inside the map
  const handleLocateMe = () => {
    if (!navigator.geolocation) return;
    setIsLocatingUser(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCurrentCoords({ lat: latitude, lng: longitude });
        if (mapInstanceRef.current && markerRef.current) {
          mapInstanceRef.current.setView([latitude, longitude], 17);
          markerRef.current.setLatLng([latitude, longitude]);
        }
        fetchAddressForCoords(latitude, longitude);
        setIsLocatingUser(false);
      },
      () => {
        setIsLocatingUser(false);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  };

  // Fly to selected quick colony
  const handleSelectColony = (colony) => {
    setCurrentCoords({ lat: colony.lat, lng: colony.lng });
    if (mapInstanceRef.current && markerRef.current) {
      mapInstanceRef.current.setView([colony.lat, colony.lng], 17);
      markerRef.current.setLatLng([colony.lat, colony.lng]);
    }
    fetchAddressForCoords(colony.lat, colony.lng);
  };

  // Search inside map
  const handleSearch = async (q) => {
    setSearchQuery(q);
    if (!q || q.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    try {
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(q.trim())}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.results) {
          setSearchResults(data.results);
        }
      }
    } catch (e) {
      console.warn('Map search error:', e);
    }
  };

  const handleSelectSearchResult = (item) => {
    setCurrentCoords({ lat: item.lat, lng: item.lng });
    if (mapInstanceRef.current && markerRef.current) {
      mapInstanceRef.current.setView([item.lat, item.lng], 17);
      markerRef.current.setLatLng([item.lat, item.lng]);
    }
    fetchAddressForCoords(item.lat, item.lng);
    setSearchResults([]);
    setSearchQuery('');
  };

  // Confirm exact location and return to checkout
  const handleConfirmLocation = async () => {
    const geoData = await fetchAddressForCoords(currentCoords.lat, currentCoords.lng);
    onSelectLocation({
      lat: currentCoords.lat,
      lng: currentCoords.lng,
      address: geoData?.wordsAddress || geoData?.address || addressPreview,
      plusCode: geoData?.plusCode || '',
      street: geoData?.street || '',
      area: geoData?.area || '',
      landmark: geoData?.landmark || '',
      pincode: geoData?.pincode || '531116',
      distanceKm: geoData?.distanceKm || 0,
      estimatedTime: geoData?.estimatedTime || '20-30 mins'
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 99999,
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '12px'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '540px',
        height: '92vh',
        maxHeight: '750px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
        position: 'relative'
      }}>
        
        {/* Header */}
        <div style={{
          padding: '14px 18px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#ffffff'
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={18} color="#ea580c" /> Pinpoint Your Exact House
            </h3>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.74rem', color: '#64748b' }}>
              Drag the pin or tap anywhere on the map to set your doorstep
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#f1f5f9',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} color="#475569" />
          </button>
        </div>

        {/* Search Bar on Map */}
        <div style={{ padding: '10px 14px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', position: 'relative' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search colony (e.g. Tagarapu, RTC, Sai Temple, Ayyannapalem)..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                paddingLeft: '32px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.82rem',
                background: '#ffffff'
              }}
            />
            <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
          </div>

          {/* Search Dropdown */}
          {searchResults.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: '14px',
              right: '14px',
              zIndex: 1000,
              background: '#ffffff',
              border: '1.5px solid #ea580c',
              borderRadius: '10px',
              marginTop: '4px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
              maxHeight: '160px',
              overflowY: 'auto'
            }}>
              {searchResults.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectSearchResult(item)}
                  style={{
                    padding: '8px 12px',
                    borderBottom: idx === searchResults.length - 1 ? 'none' : '1px solid #f1f5f9',
                    cursor: 'pointer',
                    fontSize: '0.8rem'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#fff7ed'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#ffffff'}
                >
                  <strong style={{ color: '#0f172a' }}>📍 {item.name}</strong>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{item.street}, {item.area}</div>
                </div>
              ))}
            </div>
          )}

          {/* Quick Colony Pills */}
          <div style={{
            display: 'flex',
            gap: '6px',
            overflowX: 'auto',
            paddingTop: '8px',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}>
            {QUICK_COLONIES.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => handleSelectColony(c)}
                style={{
                  padding: '4px 8px',
                  borderRadius: '999px',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  color: '#334155',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  flexShrink: 0
                }}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Map View */}
        <div style={{ flex: 1, position: 'relative', background: '#e2e8f0' }}>
          <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

          {/* Floating 'Locate Me' Button */}
          <button
            type="button"
            onClick={handleLocateMe}
            disabled={isLocatingUser}
            style={{
              position: 'absolute',
              bottom: '16px',
              right: '16px',
              zIndex: 900,
              background: '#ffffff',
              border: '2px solid #ea580c',
              borderRadius: '50%',
              width: '44px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
              cursor: 'pointer'
            }}
            title="Go to my live GPS location"
          >
            {isLocatingUser ? (
              <Compass className="animate-spin" size={20} color="#ea580c" />
            ) : (
              <Crosshair size={22} color="#ea580c" />
            )}
          </button>
        </div>

        {/* Bottom Location Preview & Confirm Card */}
        <div style={{
          padding: '14px 18px',
          background: '#ffffff',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#047857' }}>
                📍 SELECTED LOCATION
              </span>
              {distanceInfo && (
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#ea580c', background: '#fff7ed', padding: '1px 6px', borderRadius: '4px' }}>
                  {distanceInfo}
                </span>
              )}
            </div>
            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.4 }}>
              {isLoadingAddress ? 'Detecting exact address...' : addressPreview}
            </div>
            {plusCodePreview && !isLoadingAddress && (
              <div style={{ fontSize: '0.74rem', color: '#0369a1', fontWeight: 600, marginTop: '2px' }}>
                🌐 Plus Code: {plusCodePreview}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleConfirmLocation}
            style={{
              width: '100%',
              padding: '12px',
              background: '#16a34a',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              fontWeight: 800,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: '0 2px 8px rgba(22, 163, 74, 0.3)'
            }}
          >
            <Check size={18} /> Confirm This Exact Location
          </button>
        </div>

      </div>
    </div>
  );
}
