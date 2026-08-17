// Maps each Vibe destination to (a) the nearest airport city to query the
// Sky-Scrapper flights API with, and (b) a disambiguated hotel search query
// for Tripadvisor — since raw destination names don't always resolve
// cleanly to the right entity on either API.

export const DESTINATION_AIRPORTS = {
  'Coorg':        { airportQuery: 'Mangalore',    hotelQuery: 'Coorg, Karnataka, India' },
  'Rishikesh':    { airportQuery: 'Dehradun',     hotelQuery: 'Rishikesh, Uttarakhand, India' },
  'Munnar':       { airportQuery: 'Kochi',        hotelQuery: 'Munnar, Kerala, India' },
  'Spiti Valley': { airportQuery: 'Kullu Manali', hotelQuery: 'Spiti Valley, Himachal Pradesh, India' },
  'Zanskar':      { airportQuery: 'Leh',          hotelQuery: 'Zanskar, Ladakh, India' },
  'Gulmarg':      { airportQuery: 'Srinagar',     hotelQuery: 'Gulmarg, Jammu & Kashmir, India' },
  'Varanasi':     { airportQuery: 'Varanasi',     hotelQuery: 'Varanasi, Uttar Pradesh, India' },
  'Hampi':        { airportQuery: 'Hubli',        hotelQuery: 'Hampi, Karnataka, India' },
  'Madurai':      { airportQuery: 'Madurai',      hotelQuery: 'Madurai, Tamil Nadu, India' },
  'Mumbai':       { airportQuery: 'Mumbai',       hotelQuery: 'Mumbai, Maharashtra, India' },
  'Chandigarh':   { airportQuery: 'Chandigarh',   hotelQuery: 'Chandigarh, India' },
  'Kochi':        { airportQuery: 'Kochi',        hotelQuery: 'Kochi, Kerala, India' },
  'Jaipur':       { airportQuery: 'Jaipur',       hotelQuery: 'Jaipur, Rajasthan, India' },
  'Amritsar':     { airportQuery: 'Amritsar',     hotelQuery: 'Amritsar, Punjab, India' },
  'Kolkata':      { airportQuery: 'Kolkata',      hotelQuery: 'Kolkata, West Bengal, India' },
};

export const getAirportQuery = (city) => DESTINATION_AIRPORTS[city]?.airportQuery || city;
export const getHotelQuery = (city) => DESTINATION_AIRPORTS[city]?.hotelQuery || city;
