import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Cake Shoppee Bakery coordinates (Near Abes Centre, Beside Himalaya Juice Center, Main Road, Narsipatnam)
const BAKERY_LOCATION = {
  name: "Cake Shoppee",
  lat: 17.66635,
  lng: 82.61015,
  pincode: "531116"
};

// High-density Narsipatnam Municipal Colonies, Landmarks & Wards
const NARSIPATNAM_LANDMARKS = [
  { name: "Abes Centre (Main Road)", aliases: ["abes", "abes center", "main road", "himalaya juice"], lat: 17.66635, lng: 82.61015, area: "Abes Centre (Main Road)", street: "Main Road", landmark: "Beside Himalaya Juice Center" },
  { name: "Tagarapu Veedhi", aliases: ["tagarapu", "tagarapu veedhi", "tagarapu street"], lat: 17.6675, lng: 82.6115, area: "Tagarapu Veedhi", street: "Tagarapu Veedhi", landmark: "Behind Municipal Office" },
  { name: "RTC Bus Stand & Complex", aliases: ["rtc", "bus stand", "bus complex", "depot"], lat: 17.6710, lng: 82.6150, area: "RTC Complex Area", street: "RTC Complex Road", landmark: "Near RTC Main Entrance" },
  { name: "Area Hospital & DSP Office", aliases: ["hospital", "area hospital", "police station", "dsp office"], lat: 17.6625, lng: 82.6130, area: "Area Hospital Road", street: "Hospital Road", landmark: "Near Area Hospital" },
  { name: "Balighattam & Sai Baba Temple", aliases: ["balighattam", "sai temple", "sai baba", "varaha river"], lat: 17.6540, lng: 82.6030, area: "Balighattam", street: "Balighattam Road", landmark: "Near Shirdi Sai Baba Temple" },
  { name: "Govt Degree & Junior College", aliases: ["college", "degree college", "college road", "junior college"], lat: 17.6740, lng: 82.6080, area: "College Road", street: "College Road", landmark: "Near Govt Degree College" },
  { name: "Peddaboddepalli", aliases: ["peddaboddepalli", "pedaboddepalli", "boddepalli"], lat: 17.6820, lng: 82.6200, area: "Peddaboddepalli", street: "Boddepalli Main Road", landmark: "Near Boddepalli Centre" },
  { name: "Ayyannapalem", aliases: ["ayyannapalem", "ayanna palem"], lat: 17.6660, lng: 82.6090, area: "Ayyannapalem", street: "Ayyannapalem Road", landmark: "Near Subhash Statue Junction" },
  { name: "NTR Stadium & Municipal Office", aliases: ["ntr stadium", "stadium", "municipal", "municipality"], lat: 17.6650, lng: 82.6120, area: "NTR Stadium Area", street: "Municipality Road", landmark: "Near NTR Stadium Gate" },
  { name: "Shanti Nagar & Housing Board", aliases: ["shanti nagar", "shantinagar", "housing board", "colony"], lat: 17.6690, lng: 82.6050, area: "Shanti Nagar", street: "Housing Board Colony Road", landmark: "Near Housing Board Colony" },
  { name: "Lingarajupeta", aliases: ["lingarajupeta", "lingaraju peta"], lat: 17.6590, lng: 82.6180, area: "Lingarajupeta", street: "Lingarajupeta Road", landmark: "Near Primary School" },
  { name: "Cinema Road & Sri Kanya Theatre", aliases: ["theatre", "sri kanya", "jagadamba", "cinema hall"], lat: 17.6680, lng: 82.6140, area: "Cinema Road", street: "Cinema Road", landmark: "Near Sri Kanya Theatre" },
  { name: "Gandhi Park & Old Post Office", aliases: ["gandhi park", "post office"], lat: 17.6670, lng: 82.6105, area: "Gandhi Park Area", street: "Main Road", landmark: "Near Gandhi Park" },
  { name: "Court Complex & Sub-Jail", aliases: ["court", "sub-jail", "sub collector"], lat: 17.6635, lng: 82.6080, area: "Court Complex Area", street: "Court Road", landmark: "Near Sub-Collector Office" },
  { name: "Saraswathi Nagar", aliases: ["saraswathi nagar", "saraswathi temple"], lat: 17.6720, lng: 82.6120, area: "Saraswathi Nagar", street: "Saraswathi Nagar Road", landmark: "Near Saraswathi Temple" },
  { name: "Sundaraiah Nagar", aliases: ["sundaraiah nagar", "sundarayya"], lat: 17.6750, lng: 82.6170, area: "Sundaraiah Nagar", street: "Sundaraiah Nagar Road", landmark: "Near Community Hall" },
  { name: "Bapuji Nagar", aliases: ["bapuji nagar", "bapuji"], lat: 17.6685, lng: 82.6070, area: "Bapuji Nagar", street: "Bapuji Nagar Road", landmark: "Near Bapuji Park" },
  { name: "Teachers Colony", aliases: ["teachers colony"], lat: 17.6715, lng: 82.6060, area: "Teachers Colony", street: "Teachers Colony Road", landmark: "Near Teachers Colony Hall" },
  { name: "Venkatanagaram", aliases: ["venkatanagaram", "venkata nagaram"], lat: 17.6640, lng: 82.6160, area: "Venkatanagaram", street: "Venkatanagaram Road", landmark: "Near Venkatanagaram Centre" },
  { name: "Neelampeta", aliases: ["neelampeta", "neelam peta"], lat: 17.6610, lng: 82.6060, area: "Neelampeta", street: "Neelampeta Road", landmark: "Near Neelampeta Junction" },
  { name: "Dharmavaram", aliases: ["dharmavaram", "kotauratla road"], lat: 17.6760, lng: 82.6250, area: "Dharmavaram", street: "Kotauratla Road", landmark: "Near Bypass Junction" },
  { name: "Komatipalem", aliases: ["komatipalem", "komati veedhi"], lat: 17.6615, lng: 82.6210, area: "Komatipalem", street: "Komatipalem Veedhi", landmark: "Near Komatipalem Centre" },
  { name: "Pedagollapalle", aliases: ["pedagollapalle", "gollapalle"], lat: 17.6580, lng: 82.6230, area: "Pedagollapalle", street: "Pedagollapalle Road", landmark: "Near Primary School" },
  { name: "Chinagollapalle", aliases: ["chinagollapalle"], lat: 17.6550, lng: 82.6260, area: "Chinagollapalle", street: "Chinagollapalle Road", landmark: "Near Chinagollapalle Centre" },
  { name: "Vemulapudi Road", aliases: ["vemulapudi", "vemulapudi road"], lat: 17.6690, lng: 82.6220, area: "Vemulapudi Road Area", street: "Vemulapudi Road", landmark: "Near Bypass Bridge" },
  { name: "Burugupalem", aliases: ["burugupalem", "burugu palem"], lat: 17.6880, lng: 82.6120, area: "Burugupalem", street: "Burugupalem Road", landmark: "Near Burugupalem Centre" }
];

// Haversine formula to calculate distance in km
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round((R * c) * 10) / 10;
}

// Standard Open Location Code (Google Plus Code generator) matching Google Maps 100%
function getGooglePlusCode(latitude, longitude) {
  const CODE_ALPHABET = '23456789CFGHJMPQRVWX';
  let lat = Math.min(90, Math.max(-90, latitude));
  let lng = Math.min(180, Math.max(-180, longitude));
  if (lat === 90) lat = 89.999999;
  
  let latVal = lat + 90;
  let lngVal = lng + 180;
  let code = '';
  const latSteps = [20, 1, 0.05, 0.0025, 0.000125];
  const lngSteps = [20, 1, 0.05, 0.0025, 0.000125];
  for (let i = 0; i < 5; i++) {
    const latDigit = Math.floor(latVal / latSteps[i]);
    const lngDigit = Math.floor(lngVal / lngSteps[i]);
    latVal -= latDigit * latSteps[i];
    lngVal -= lngDigit * lngSteps[i];
    code += CODE_ALPHABET[latDigit] + CODE_ALPHABET[lngDigit];
    if (i === 3) code += '+';
  }
  const row = Math.floor(latVal / (0.000125 / 5));
  const col = Math.floor(lngVal / (0.000125 / 4));
  const gridIndex = Math.min(19, Math.max(0, row * 4 + col));
  const gridChar = CODE_ALPHABET[gridIndex] || '';

  return code.slice(4) + gridChar;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = parseFloat(searchParams.get('lat'));
    const lng = parseFloat(searchParams.get('lng'));
    const query = searchParams.get('q');

    // Scenario A: Landmark or colony search query
    if (query && query.trim().length > 1) {
      const q = query.toLowerCase().trim();
      const matched = NARSIPATNAM_LANDMARKS.filter(item => 
        item.name.toLowerCase().includes(q) || 
        item.aliases.some(a => a.includes(q)) ||
        item.area.toLowerCase().includes(q)
      );

      const results = matched.map(m => {
        const dist = calculateDistance(BAKERY_LOCATION.lat, BAKERY_LOCATION.lng, m.lat, m.lng);
        return {
          name: m.name,
          area: m.area,
          street: m.street,
          landmark: m.landmark,
          lat: m.lat,
          lng: m.lng,
          pincode: "531116",
          distanceKm: dist,
          estimatedTime: dist <= 1.5 ? "15-20 mins" : dist <= 3.5 ? "20-30 mins" : "30-40 mins",
          formatted: `${m.street}, ${m.area}, Narsipatnam - 531116`
        };
      });

      return NextResponse.json({ success: true, results });
    }

    // Scenario B: Reverse geocode coordinates
    if (!isNaN(lat) && !isNaN(lng)) {
      const distance = calculateDistance(BAKERY_LOCATION.lat, BAKERY_LOCATION.lng, lat, lng);
      const plusCodeLocal = getGooglePlusCode(lat, lng);
      
      // Find closest landmark in our comprehensive Narsipatnam grid
      let closestLandmark = NARSIPATNAM_LANDMARKS[0];
      let minDistance = 99999;
      for (const lm of NARSIPATNAM_LANDMARKS) {
        const d = calculateDistance(lat, lng, lm.lat, lm.lng);
        if (d < minDistance) {
          minDistance = d;
          closestLandmark = lm;
        }
      }

      // Check for available external Geocoding API keys
      const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      const LOCATIONIQ_KEY = process.env.LOCATIONIQ_API_KEY;

      // 1. PROVIDER 1: Google Maps Geocoding API (100% exact rooftop precision across India)
      if (GOOGLE_API_KEY) {
        try {
          const gRes = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}&language=en`,
            { next: { revalidate: 3600 } }
          );
          if (gRes.ok) {
            const gData = await gRes.json();
            if (gData.status === 'OK' && gData.results && gData.results.length > 0) {
              const best = gData.results[0];
              const comps = best.address_components || [];

              const getComp = (types) => {
                const found = comps.find(c => types.some(t => c.types.includes(t)));
                return found ? found.long_name : '';
              };

              const streetNumber = getComp(['street_number']);
              const premise = getComp(['premise', 'subpremise']);
              const route = getComp(['route']);
              const sublocality = getComp(['sublocality_level_1', 'sublocality', 'neighborhood']);
              const locality = getComp(['locality']) || 'Narsipatnam';
              const district = getComp(['administrative_area_level_2']) || 'Anakapalli';
              const state = getComp(['administrative_area_level_1']) || 'Andhra Pradesh';
              const postalCode = getComp(['postal_code']) || '531116';

              const buildingPart = [premise, streetNumber].filter(Boolean).join(', ');
              const areaPart = sublocality || closestLandmark.area;
              const streetPart = route || closestLandmark.street;

              const cleanWords = [buildingPart, streetPart, areaPart, locality].filter(Boolean).join(', ');
              const cleanAddress = best.formatted_address || `${cleanWords} - ${postalCode}`;

              return NextResponse.json({
                success: true,
                provider: 'google_maps',
                address: cleanAddress,
                wordsAddress: cleanWords,
                plusCode: `${plusCodeLocal} ${locality}, ${state}`,
                plusCodeLocal: plusCodeLocal,
                area: areaPart,
                village: locality,
                mandal: locality,
                street: streetPart,
                landmark: closestLandmark.landmark,
                pincode: postalCode,
                lat: lat,
                lng: lng,
                distanceKm: distance,
                estimatedTime: distance <= 1.5 ? "15-20 mins" : distance <= 3.5 ? "20-30 mins" : distance <= 8 ? "30-40 mins" : "45-60 mins",
                isWithinDeliveryRange: distance <= 15,
                mapsUrl: `https://maps.google.com/?q=${lat},${lng}`
              });
            }
          }
        } catch (gErr) {
          console.warn('Google Maps Geocode failed, falling back:', gErr);
        }
      }

      // 2. PROVIDER 2: LocationIQ API (Free tier: 5,000 free requests/day)
      if (LOCATIONIQ_KEY) {
        try {
          const lRes = await fetch(
            `https://us1.locationiq.com/v1/reverse?key=${LOCATIONIQ_KEY}&lat=${lat}&lon=${lng}&format=json&accept-language=en`
          );
          if (lRes.ok) {
            const lData = await lRes.json();
            if (lData && lData.address) {
              const la = lData.address;
              const lArea = la.neighbourhood || la.suburb || la.village || closestLandmark.area;
              const lStreet = la.road || closestLandmark.street;
              const lTown = la.town || la.city || 'Narsipatnam';
              const lPostcode = la.postcode || '531116';
              const words = `${lStreet ? lStreet + ', ' : ''}${lArea}, ${lTown}`;

              return NextResponse.json({
                success: true,
                provider: 'locationiq',
                address: lData.display_name || `${words} - ${lPostcode}`,
                wordsAddress: words,
                plusCode: `${plusCodeLocal} ${lTown}, Andhra Pradesh`,
                plusCodeLocal: plusCodeLocal,
                area: lArea,
                village: lTown,
                mandal: lTown,
                street: lStreet,
                landmark: closestLandmark.landmark,
                pincode: lPostcode,
                lat: lat,
                lng: lng,
                distanceKm: distance,
                estimatedTime: distance <= 1.5 ? "15-20 mins" : distance <= 3.5 ? "20-30 mins" : "30-40 mins",
                isWithinDeliveryRange: distance <= 15,
                mapsUrl: `https://maps.google.com/?q=${lat},${lng}`
              });
            }
          }
        } catch (lErr) {
          console.warn('LocationIQ geocode failed, falling back:', lErr);
        }
      }

      // 3. PROVIDER 3: OpenStreetMap Nominatim + BigDataCloud (Free / No Key)
      let detectedStreet = '';
      let detectedNeighbourhood = '';
      let detectedVillage = '';
      let detectedMandal = '';
      let detectedDistrict = 'Anakapalli';
      let detectedState = 'Andhra Pradesh';
      let detectedPincode = '531116';

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);

        const osmRes = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
          {
            headers: {
              'User-Agent': 'CakeShoppeeBakery/2.0 (order@cakeshoppee.com; Narsipatnam)',
              'Accept-Language': 'en'
            },
            signal: controller.signal
          }
        );
        clearTimeout(timeoutId);

        if (osmRes.ok) {
          const d = await osmRes.json();
          if (d && d.address) {
            const a = d.address;
            const rawRoad = a.road || a.pedestrian || a.path || '';
            if (rawRoad && !/^(SH|MDR|NH|State Highway|Major District Road)/i.test(rawRoad)) {
              detectedStreet = rawRoad;
            }
            detectedNeighbourhood = a.neighbourhood || a.suburb || a.hamlet || a.quarter || '';
            detectedVillage = a.village || a.town || a.city || '';
            detectedMandal = a.county || '';
            if (a.state) detectedState = a.state;
            if (a.postcode) detectedPincode = a.postcode;
          }
        }
      } catch (e) {
        // Fallback silently if Nominatim network times out
      }

      // Try BigDataCloud if neighbourhood is still empty
      if (!detectedNeighbourhood && !detectedStreet) {
        try {
          const controller2 = new AbortController();
          const timeoutId2 = setTimeout(() => controller2.abort(), 3000);

          const bdcRes = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`,
            { signal: controller2.signal }
          );
          clearTimeout(timeoutId2);

          if (bdcRes.ok) {
            const bdc = await bdcRes.json();
            if (bdc.locality && bdc.locality !== 'Andhra Pradesh') {
              detectedNeighbourhood = bdc.locality;
            }
            if (bdc.principalSubdivision) detectedState = bdc.principalSubdivision;
            if (bdc.postcode) detectedPincode = bdc.postcode;
          }
        } catch (e2) {
          // Fallback silently
        }
      }

      // Filter out generic administrative, town, mandal, or highway names
      const GENERIC_EXCLUSIONS = [
        'narsipatnam urban', 'narsipatnam mandal', 'narsipatnam',
        'andhra pradesh', 'india', 'anakapalli', 'anakapalli district',
        'unknown', 'null', 'undefined'
      ];
      const isBadName = (str) => {
        if (!str) return true;
        const s = String(str).toLowerCase().trim();
        return GENERIC_EXCLUSIONS.includes(s) || s.startsWith('sh') || s.startsWith('mdr') || s.startsWith('state highway');
      };

      let resolvedArea = '';
      let resolvedStreet = (!isBadName(detectedStreet)) ? detectedStreet : '';
      let resolvedLandmark = '';
      let wordsAddress = '';
      let finalAddress = '';
      let plusCodeFull = '';

      // Check if coordinates fall within the Narsipatnam delivery cluster (<= 25 km)
      if (distance <= 25) {
        const specificOsmArea = [detectedNeighbourhood, detectedVillage].find(n => !isBadName(n));
        
        resolvedArea = closestLandmark.area;
        if (specificOsmArea && specificOsmArea.toLowerCase() !== 'narsipatnam') {
          const aliasMatch = NARSIPATNAM_LANDMARKS.find(l => 
            l.aliases.some(al => specificOsmArea.toLowerCase().includes(al))
          );
          if (aliasMatch) {
            resolvedArea = aliasMatch.area;
          }
        }

        if (!resolvedStreet && closestLandmark.street) {
          resolvedStreet = closestLandmark.street;
        }
        resolvedLandmark = closestLandmark.landmark;

        const streetPart = (resolvedStreet && resolvedStreet !== resolvedArea) ? `${resolvedStreet}, ` : '';
        wordsAddress = `${streetPart}${resolvedArea}, Narsipatnam`;
        finalAddress = `${streetPart}${resolvedArea}, Narsipatnam - 531116`;
        plusCodeFull = `${plusCodeLocal} Narsipatnam, Andhra Pradesh`;
      } else {
        const placeCandidate = [
          detectedVillage,
          detectedNeighbourhood,
          detectedMandal ? detectedMandal.replace(' Mandal', '') : '',
          closestLandmark.area
        ].find(n => !isBadName(n)) || closestLandmark.area;

        resolvedArea = placeCandidate;
        wordsAddress = `${placeCandidate}, ${detectedState}`;
        finalAddress = `${placeCandidate}, ${detectedState}${detectedPincode ? ` - ${detectedPincode}` : ''}`;
        plusCodeFull = `${plusCodeLocal} ${placeCandidate}, ${detectedState}`;
      }

      return NextResponse.json({
        success: true,
        provider: 'osm_bdc_fallback',
        address: finalAddress,
        wordsAddress: wordsAddress,
        plusCode: plusCodeFull,
        plusCodeLocal: plusCodeLocal,
        area: resolvedArea,
        village: detectedVillage || resolvedArea,
        mandal: "Narsipatnam",
        street: resolvedStreet,
        landmark: resolvedLandmark,
        pincode: detectedPincode || "531116",
        lat: lat,
        lng: lng,
        distanceKm: distance,
        estimatedTime: distance <= 1.5 ? "15-20 mins" : distance <= 3.5 ? "20-30 mins" : distance <= 8 ? "30-40 mins" : "45-60 mins",
        isWithinDeliveryRange: distance <= 15,
        mapsUrl: `https://maps.google.com/?q=${lat},${lng}`
      });
    }

    return NextResponse.json({ success: false, error: 'Provide lat & lng or search query q' }, { status: 400 });
  } catch (error) {
    console.error('Geocode route error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
