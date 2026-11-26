import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Cake Shoppee Bakery coordinates (Near Abes Centre, Beside Himalaya Juice Center, Main Road, Narsipatnam)
const BAKERY_LOCATION = {
  name: "Cake Shoppee",
  lat: 17.66635,
  lng: 82.61015,
  pincode: "531116"
};

// Curated Narsipatnam landmarks & localities for search and reference
const NARSIPATNAM_LANDMARKS = [
  { name: "Near Abes Centre (Main Road)", aliases: ["abes", "abes center", "main road", "himalaya juice"], lat: 17.66635, lng: 82.61015, area: "Near Abes Centre (Main Road)", street: "Main Road", landmark: "Beside Himalaya Juice Center" },
  { name: "RTC Bus Stand / Complex", aliases: ["rtc", "bus stand", "bus complex", "depot"], lat: 17.6710, lng: 82.6150, area: "Near RTC Bus Stand / Complex", street: "RTC Complex Road", landmark: "Near RTC Main Entrance" },
  { name: "Area Hospital & Police Station", aliases: ["hospital", "area hospital", "police station", "dsp office"], lat: 17.6625, lng: 82.6130, area: "Other Narsipatnam Locality", street: "Hospital Road", landmark: "Opposite Area Hospital" },
  { name: "Balighattam & Shirdi Sai Temple", aliases: ["balighattam", "sai temple", "sai baba", "varaha river"], lat: 17.6540, lng: 82.6030, area: "Balighattam & Temple Road", street: "Balighattam Main Road", landmark: "Near Shirdi Sai Baba Temple" },
  { name: "Govt Degree College & College Road", aliases: ["college", "degree college", "college road", "junior college"], lat: 17.6740, lng: 82.6080, area: "College Road / Station Road", street: "College Road", landmark: "Near Govt Degree College" },
  { name: "Peddaboddepalli Area", aliases: ["peddaboddepalli", "pedaboddepalli", "boddepalli"], lat: 17.6820, lng: 82.6200, area: "Peddaboddepalli Area", street: "Peddaboddepalli Road", landmark: "Near Boddepalli Centre" },
  { name: "Tagarapu Veedhi", aliases: ["tagarapu", "tagarapu veedhi", "tagarapu street"], lat: 17.6675, lng: 82.6115, area: "Tagarapu Veedhi", street: "Tagarapu Veedhi", landmark: "Behind Municipal Office" },
  { name: "Ayyannapalem", aliases: ["ayyannapalem", "ayanna palem"], lat: 17.6660, lng: 82.6090, area: "Other Narsipatnam Locality", street: "Ayyannapalem Road", landmark: "Near Ayyannapalem" },
  { name: "NTR Stadium & Municipal Office", aliases: ["ntr stadium", "stadium", "municipal", "municipality"], lat: 17.6650, lng: 82.6120, area: "Near Abes Centre (Main Road)", street: "Municipality Road", landmark: "Near NTR Stadium Gate" },
  { name: "Shanti Nagar & Housing Board", aliases: ["shanti nagar", "shantinagar", "housing board", "colony"], lat: 17.6690, lng: 82.6050, area: "Shanti Nagar / Housing Board", street: "Shanti Nagar Road", landmark: "Near Housing Board Colony" },
  { name: "Lingarajupeta", aliases: ["lingarajupeta", "lingaraju peta"], lat: 17.6590, lng: 82.6180, area: "Lingarajupeta", street: "Lingarajupeta Road", landmark: "Near Primary School" },
  { name: "Dharmavaram & Kotauratla Road", aliases: ["dharmavaram", "kotauratla", "station road"], lat: 17.6760, lng: 82.6250, area: "Dharmavaram / Kotauratla Road", street: "Kotauratla Road", landmark: "Near Bypass Junction" },
  { name: "Sri Kanya & Jagadamba Theatres", aliases: ["theatre", "sri kanya", "jagadamba", "cinema hall"], lat: 17.6680, lng: 82.6140, area: "Near Abes Centre (Main Road)", street: "Cinema Road", landmark: "Near Sri Kanya Theatre" }
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

// Open Location Code (Google Plus Code generator)
function getGooglePlusCode(latitude, longitude) {
  const ALPHABET = '23456789CFGHJMPQRVWX';
  let lat = Math.min(90, Math.max(-90, latitude));
  let lng = Math.min(180, Math.max(-180, longitude));
  if (lat === 90) lat = 89.999999;
  
  let latVal = Math.floor((lat + 90) * 8000 * 1000) / 1000;
  let lngVal = Math.floor((lng + 180) * 8000 * 1000) / 1000;
  
  let code = '';
  for (let i = 0; i < 5; i++) {
    const latDigit = Math.floor(latVal / Math.pow(20, 4 - i)) % 20;
    const lngDigit = Math.floor(lngVal / Math.pow(20, 4 - i)) % 20;
    code += ALPHABET[latDigit] + ALPHABET[lngDigit];
    if (i === 3) code += '+';
  }
  // Optional 11th grid sub-digit
  const subIndex = Math.floor(((lat + 90) * 8000 * 20 * 4) % 20);
  const extraChar = ALPHABET[subIndex] || '';

  return code.slice(4) + (extraChar ? extraChar : '');
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
          estimatedTime: dist <= 2 ? "20-25 mins" : "30-40 mins",
          formatted: `${m.street}, ${m.area}, Narsipatnam - 531116`
        };
      });

      return NextResponse.json({ success: true, results });
    }

    // Scenario B: Reverse geocode coordinates
    if (!isNaN(lat) && !isNaN(lng)) {
      const distance = calculateDistance(BAKERY_LOCATION.lat, BAKERY_LOCATION.lng, lat, lng);
      
      let detectedVillage = '';
      let detectedMandal = '';
      let detectedDistrict = '';
      let detectedState = 'Andhra Pradesh';
      let detectedPincode = '';
      let street = '';

      // 1. Query OSM Nominatim at zoom=14 for true village/town/suburb level
      try {
        const osmRes14 = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`, {
          headers: {
            'User-Agent': 'CakeShoppeeBakery/1.0 (info@cakeshoppee.com)',
            'Accept-Language': 'en'
          },
          next: { revalidate: 3600 }
        });
        if (osmRes14.ok) {
          const d14 = await osmRes14.json();
          if (d14 && d14.address) {
            const addr = d14.address;
            detectedVillage = addr.village || addr.suburb || addr.town || addr.residential || d14.name || '';
            detectedMandal = addr.county || '';
            detectedDistrict = addr.state_district || '';
            detectedState = addr.state || 'Andhra Pradesh';
            detectedPincode = addr.postcode || '';
          }
        }
      } catch (e) {
        console.warn('Server OSM zoom 14 error:', e);
      }

      // 2. Query OSM Nominatim at zoom=18 for street name (filter out technical highway codes)
      try {
        const osmRes18 = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`, {
          headers: {
            'User-Agent': 'CakeShoppeeBakery/1.0 (info@cakeshoppee.com)',
            'Accept-Language': 'en'
          },
          next: { revalidate: 3600 }
        });
        if (osmRes18.ok) {
          const d18 = await osmRes18.json();
          if (d18 && d18.address) {
            const rawRoad = d18.address.road || '';
            if (rawRoad && !/^(SH|MDR|NH|State Highway|Major District Road)/i.test(rawRoad)) {
              street = rawRoad;
            }
          }
        }
      } catch (e) {
        console.warn('Server OSM zoom 18 error:', e);
      }

      // 3. Fallback to BigDataCloud if village is still empty
      if (!detectedVillage) {
        try {
          const bdcRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`);
          if (bdcRes.ok) {
            const bdcData = await bdcRes.json();
            detectedVillage = bdcData.locality || bdcData.city || '';
            if (bdcData.principalSubdivision) detectedState = bdcData.principalSubdivision;
          }
        } catch (e2) {
          console.warn('Server BigDataCloud fallback error:', e2);
        }
      }

      // 4. Calculate Google Plus Code
      const plusCodeLocal = getGooglePlusCode(lat, lng);

      // 5. Check if user is within close proximity to a known Narsipatnam town landmark (<= 1.2 km)
      let closestLandmark = NARSIPATNAM_LANDMARKS[0];
      let minDistance = 99999;
      for (const lm of NARSIPATNAM_LANDMARKS) {
        const d = calculateDistance(lat, lng, lm.lat, lm.lng);
        if (d < minDistance) {
          minDistance = d;
          closestLandmark = lm;
        }
      }

      let matchedArea = '';
      let wordsAddress = '';
      let finalAddress = '';
      let plusCodeFull = '';
      let finalStreet = street;
      let finalLandmark = '';

      if (minDistance <= 1.2 && distance <= 3.5) {
        // Customer is inside Narsipatnam town
        matchedArea = closestLandmark.area;
        finalStreet = street || closestLandmark.street;
        finalLandmark = closestLandmark.landmark || `Near ${closestLandmark.name}`;
        
        const distMeters = Math.round(minDistance * 1000);
        if (distMeters <= 180) {
          wordsAddress = (finalStreet && finalStreet !== closestLandmark.area ? `${finalStreet}, ` : '') + `${closestLandmark.area}, Narsipatnam`;
        } else if (distMeters <= 500) {
          wordsAddress = `Near ${closestLandmark.landmark || closestLandmark.name}, ${closestLandmark.area}, Narsipatnam`;
        } else {
          wordsAddress = `${closestLandmark.area}, Narsipatnam`;
        }

        wordsAddress = wordsAddress.replace(/Tagarapu Veedhi, Tagarapu Veedhi/g, 'Tagarapu Veedhi');
        wordsAddress = wordsAddress.replace(/Lingarajupeta, Lingarajupeta/g, 'Lingarajupeta');
        wordsAddress = wordsAddress.replace(/Near Abes Centre \(Main Road\)/g, 'Abes Centre, Main Road');

        finalAddress = `${wordsAddress} - 531116`;
        plusCodeFull = `${plusCodeLocal} Narsipatnam, Andhra Pradesh`;
      } else {
        // Customer is outside town / in specific locality/village (e.g. Burugupalem, Makavarapalem)
        const placeName = detectedVillage || (detectedMandal ? detectedMandal.replace(' Mandal', '') : 'Andhra Pradesh');
        matchedArea = placeName;
        finalStreet = street || placeName;
        finalLandmark = detectedMandal ? `Near ${placeName} (${detectedMandal})` : `Near ${placeName}`;

        wordsAddress = `${placeName}, ${detectedState}`;
        finalAddress = `${placeName}${detectedMandal ? `, ${detectedMandal}` : ''}, ${detectedState}${detectedPincode ? ` - ${detectedPincode}` : ''}`;
        plusCodeFull = `${plusCodeLocal} ${placeName}, ${detectedState}`;
      }

      return NextResponse.json({
        success: true,
        address: finalAddress,
        wordsAddress: wordsAddress,
        plusCode: plusCodeFull,
        plusCodeLocal: plusCodeLocal,
        area: matchedArea,
        village: detectedVillage || matchedArea,
        mandal: detectedMandal,
        street: finalStreet,
        landmark: finalLandmark,
        pincode: detectedPincode || (minDistance <= 1.2 ? "531116" : ""),
        lat: lat,
        lng: lng,
        distanceKm: distance,
        estimatedTime: distance <= 2 ? "20-25 mins" : distance <= 5 ? "25-35 mins" : distance <= 15 ? "35-50 mins" : "50-60 mins",
        isWithinDeliveryRange: distance <= 25,
        mapsUrl: `https://maps.google.com/?q=${lat},${lng}`
      });
    }

    return NextResponse.json({ success: false, error: 'Provide lat & lng or search query q' }, { status: 400 });
  } catch (error) {
    console.error('Geocode route error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
