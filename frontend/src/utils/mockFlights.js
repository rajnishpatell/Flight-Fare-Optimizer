import airports from "../data/airports.json";

const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

// 🕒 Utility: Format number to 2-digit (e.g., 8 → "08")
const pad = (num) => String(num).padStart(2, "0");

// 🕐 Utility: Add minutes to a time
function addMinutes(hour, minute, add) {
  const total = hour * 60 + minute + add;
  const h = Math.floor((total % (24 * 60)) / 60);
  const m = total % 60;
  return { h, m };
}

// ⏱️ Utility: Compute duration between two times
function calculateDuration(depH, depM, arrH, arrM) {
  const depTotal = depH * 60 + depM;
  const arrTotal = arrH * 60 + arrM;
  const diff = arrTotal >= depTotal ? arrTotal - depTotal : 24 * 60 - depTotal + arrTotal;
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  return `${pad(h)}h ${pad(m)}m`;
}

function findAirport(input) {
  if (!input) return null;
  const query = input.trim().toUpperCase();

  // Try matching by IATA first
  let airport = airports.find((a) => a.iata.toUpperCase() === query);

  // Then exact city or airport name
  if (!airport) {
    airport = airports.find(
      (a) => a.city.toUpperCase() === query || a.name.toUpperCase() === query
    );
  }

  return airport || null;
}

export function generateMockFlights(fromInput, toInput, date, passengers) {
  const totalFlights = Math.floor(Math.random() * 5) + 3; // 5–10 flights
  const fromAirport = findAirport(fromInput);
  const toAirport = findAirport(toInput);

  if (!fromAirport || !toAirport) {
    console.warn("Invalid airports:", fromInput, toInput);
    return [];
  }

  const results = [];

  // Step 1️⃣ — Generate Direct Flights
  for (let i = 0; i < totalFlights; i++) {
    const id = `FL${Math.floor(Math.random() * 9000) + 1000}`;
    const airline = randomItem([
      "IndiGo",
      "Air India",
      "SpiceJet",
      "Vistara",
      "Akasa Air",
      "Go First",
      "Alliance Air",
    ]);

    // Random realistic departure time
    const departHour = Math.floor(Math.random() * 18) + 4; // 04–22 hrs
    const departMinute = Math.floor(Math.random() * 60);

    // Random realistic flight duration (in minutes)
    const durationMins = Math.floor(Math.random() * 180) + 60; // 1h–4h
    const { h: arriveHour, m: arriveMinute } = addMinutes(
      departHour,
      departMinute,
      durationMins
    );

    const basePrice = Math.floor(Math.random() * 10000) + 2500; // ₹2500–₹12500

    results.push({
      id,
      airline,
      price: basePrice,
      currency: "₹",
      from: fromAirport.iata,
      to: toAirport.iata,
      departTime: `${pad(departHour)}:${pad(departMinute)}`,
      arriveTime: `${pad(arriveHour)}:${pad(arriveMinute)}`,
      duration: calculateDuration(departHour, departMinute, arriveHour, arriveMinute),
      stops: [],
      hidden_city: false,
      saving: null,
      legs: [
        {
          from: fromAirport.iata,
          to: toAirport.iata,
          dep: `${pad(departHour)}:${pad(departMinute)}`,
          arr: `${pad(arriveHour)}:${pad(arriveMinute)}`,
        },
      ],
      fromCity: fromAirport.city,
      toCity: toAirport.city,
    });
  }

  // Step 2️⃣ — Find Cheapest Direct Flight
  const cheapestDirect = results.reduce((min, f) => (f.price < min.price ? f : min));

  // Step 3️⃣ — Add Hidden City Flights
  const hiddenCityCount = Math.floor(Math.random() * 3) + 2; // 2–5 hidden-city options

  for (let i = 0; i < hiddenCityCount; i++) {
    const onward = randomItem(
      airports.filter(
        (a) =>
          a.iata !== fromAirport.iata &&
          a.iata !== toAirport.iata &&
          a.city !== fromAirport.city &&
          a.city !== toAirport.city
      )
    );

    const id = `HC${Math.floor(Math.random() * 9000) + 1000}`;
    const airline = randomItem([
      "IndiGo",
      "Air India",
      "SpiceJet",
      "Vistara",
      "Akasa Air",
    ]);

    const departHour = Math.floor(Math.random() * 18) + 4;
    const departMinute = Math.floor(Math.random() * 60);

    // Leg 1: from → destination
    const leg1Mins = Math.floor(Math.random() * 120) + 60; // 1–3h
    const { h: layoverArrH, m: layoverArrM } = addMinutes(
      departHour,
      departMinute,
      leg1Mins
    );

    // Layover time (30–90 mins)
    const layoverMins = Math.floor(Math.random() * 60) + 30;

    // Leg 2: destination → onward
    const leg2Mins = Math.floor(Math.random() * 150) + 60; // 1–3.5h
    const { h: arriveHour, m: arriveMinute } = addMinutes(
      layoverArrH,
      layoverArrM,
      layoverMins + leg2Mins
    );

    // Hidden-city cheaper than cheapest direct
    const hiddenCityPrice =
      cheapestDirect.price - (Math.floor(Math.random() * 1800) + 500);
    const saving = Math.max(cheapestDirect.price - hiddenCityPrice, 0);

    const totalDuration = calculateDuration(
      departHour,
      departMinute,
      arriveHour,
      arriveMinute
    );

    results.push({
      id,
      airline,
      price: hiddenCityPrice,
      currency: "₹",
      from: fromAirport.iata,
      to: onward.iata, // continues beyond user destination
      departTime: `${pad(departHour)}:${pad(departMinute)}`,
      arriveTime: `${pad(arriveHour)}:${pad(arriveMinute)}`,
      duration: totalDuration,
      stops: [toAirport.iata],
      hidden_city: true,
      saving: `₹${saving}`,
      legs: [
        {
          from: fromAirport.iata,
          to: toAirport.iata,
          dep: `${pad(departHour)}:${pad(departMinute)}`,
          arr: `${pad(layoverArrH)}:${pad(layoverArrM)}`,
        },
        {
          from: toAirport.iata,
          to: onward.iata,
          dep: `${pad(addMinutes(layoverArrH, layoverArrM, layoverMins).h)}:${pad(
            addMinutes(layoverArrH, layoverArrM, layoverMins).m
          )}`,
          arr: `${pad(arriveHour)}:${pad(arriveMinute)}`,
        },
      ],
      fromCity: fromAirport.city,
      toCity: toAirport.city,
    });
  }

  return results.sort((a, b) => a.price - b.price);
}

