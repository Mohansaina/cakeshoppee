import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Cake Shoppee Bakery coordinates (Near Abes Centre, Beside Himalaya Juice Center, Main Road, Narsipatnam)
const BAKERY_LOCATION = {
  name: "Cake Shoppee",
  lat: 17.66635,
  lng: 82.61015,
  pincode: "531116"
};

// Curated high-precision Narsipatnam landmarks & localities
const NARSIPATNAM_LANDMARKS = [
  { name: "Near Abes Centre (Main Road)", aliases: ["abes", "abes center", "main road", "himalaya juice"], lat: 17.66635, lng: 82.61015, area: "Near Abes Centre (Main Road)", street: "Main Road", landmark: "Beside Himalaya Juice Center" },
  { name: "RTC Bus Stand / Complex", aliases: ["rtc", "bus stand", "bus complex", "depot"], lat: 17.6710, lng: 82.6150, area: "Near RTC Bus Stand / Complex", street: "RTC Complex Road", landmark: "Near RTC Main Entrance" },
  { name: "Area Hospital & Police Station", aliases: ["hospital", "area hospital", "police station", "dsp office"], lat: 17.6625, lng: 82.6130, area: "Other Narsipatnam Locality", street: "Hospital Road", landmark: "Opposite Area Hospital" },
  { name: "Balighattam & Shirdi Sai Temple", aliases: ["balighattam", "sai temple", "sai baba", "varaha river"], lat: 17.6540, lng: 82.6030, area: "Balighattam & Temple Road", street: "Balighattam Main Road", landmark: "Near Shirdi Sai Baba Temple" },
  { name: "Govt Degree College & College Road", aliases: ["college", "degree college", "college road", "junior college"], lat: 17.6740, lng: 82.6080, area: "College Road / Station Road", street: "College Road", landmark: "Near Govt Degree College" },
  { name: "Peddaboddepalli Junction", aliases: ["peddaboddepalli", "pedaboddepalli", "boddepalli"], lat: 17.6820, lng: 82.6200, area: "Peddaboddepalli Area", street: "Peddaboddepalli Main Road", landmark: "Near Boddepalli Centre" },
  { name: "Tagarapu Veedhi", aliases: ["tagarapu", "tagarapu veedhi", "tagarapu street"], lat: 17.6675, lng: 82.6115, area: "Tagarapu Veedhi", street: "Tagarapu Veedhi", landmark: "Behind Municipal Office" },
  { name: "NTR Stadium & Municipal Office", aliases: ["ntr stadium", "stadium", "municipal", "municipality"], lat: 17.6650, lng: 82.6120, area: "Near Abes Centre (Main Road)", street: "Municipality Road", landmark: "Near NTR Stadium Gate" },
  { name: "Shanti Nagar & Housing Board", aliases: ["shanti nagar", "shantinagar", "housing board", "colony"], lat: 17.6690, lng: 82.6050, area: "Shanti Nagar / Housing Board", street: "Shanti Nagar Main Road", landmark: "Near Housing Board Park" },
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
      
      let street = '';
      let area = 'Near Abes Centre (Main Road)';
      let colony = '';
      let landmark = '';
      let pincode = '531116';
      let fullDisplayName = '';

      // 1. Try reverse geocoding via OpenStreetMap with compliant headers
      try {
        const osmRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&addressdetails=1`, {
          headers: {
            'User-Agent': 'CakeShoppeeBakery/1.0 (info@cakeshoppee.com)',
            'Accept-Language': 'en'
          },
          next: { revalidate: 3600 }
        });

        if (osmRes.ok) {
          const data = await osmRes.json();
          if (data && data.address) {
            const addr = data.address;
            street = addr.road || addr.residential || addr.suburb || addr.neighbourhood || '';
            colony = addr.neighbourhood || addr.suburb || addr.residential || addr.village || '';
            pincode = addr.postcode || '531116';
            fullDisplayName = data.display_name ? data.display_name.split(',').slice(0, 4).join(', ') : '';
          }
        }
      } catch (e) {
        console.warn('Server OSM reverse geocode error:', e);
      }

      // 2. Fallback to BigDataCloud if OSM is missing street
      if (!street) {
        try {
          const bdcRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`);
          if (bdcRes.ok) {
            const bdcData = await bdcRes.json();
            street = bdcData.locality || bdcData.principalSubdivision || '';
            colony = bdcData.city || 'Narsipatnam';
            if (!fullDisplayName) {
              fullDisplayName = `${street}, ${colony}, Narsipatnam`;
            }
          }
        } catch (e2) {
          console.warn('Server BigDataCloud fallback error:', e2);
        }
      }

      // 3. Find closest known Narsipatnam landmark to pinpoint exact area
      let closestLandmark = NARSIPATNAM_LANDMARKS[0];
      let minDistance = 99999;
      for (const lm of NARSIPATNAM_LANDMARKS) {
        const d = calculateDistance(lat, lng, lm.lat, lm.lng);
        if (d < minDistance) {
          minDistance = d;
          closestLandmark = lm;
        }
      }

      // Auto-assign area based on closest landmark (within 2 km)
      if (minDistance <= 2.5) {
        area = closestLandmark.area;
        if (!landmark) {
          landmark = `Near ${closestLandmark.name}`;
        }
      }

      // Format clean, crisp readable address for customer & delivery rider
      const cleanStreet = street || closestLandmark.street;
      const cleanArea = area;
      const cleanFullAddress = fullDisplayName 
        ? fullDisplayName 
        : `${cleanStreet}, ${cleanArea}, Narsipatnam - ${pincode}`;

      return NextResponse.json({
        success: true,
        address: cleanFullAddress,
        street: cleanStreet,
        area: cleanArea,
        landmark: landmark || `Near ${closestLandmark.name}`,
        pincode: pincode || "531116",
        lat: lat,
        lng: lng,
        distanceKm: distance,
        estimatedTime: distance <= 2 ? "20-25 mins" : distance <= 5 ? "25-35 mins" : "35-50 mins",
        isWithinDeliveryRange: distance <= 15,
        closestLandmark: closestLandmark.name,
        mapsUrl: `https://maps.google.com/?q=${lat},${lng}`
      });
    }

    return NextResponse.json({ success: false, error: 'Provide lat & lng or search query q' }, { status: 400 });
  } catch (error) {
    console.error('Geocode route error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
