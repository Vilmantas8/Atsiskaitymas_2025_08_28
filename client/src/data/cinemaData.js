// Lietuvos kino teatrų duomenys
export const lithuanianCinemas = [
  // Vilnius
  {
    id: 'forum-vingis',
    name: 'Forum Cinemas Vingis',
    city: 'Vilnius',
    address: 'Kalvarijų g. 144',
    halls: 9,
    capacity: 1700,
    features: ['IMAX', '3D', 'iLUXE', 'Dolby Atmos']
  },
  {
    id: 'forum-akropolis',
    name: 'Forum Cinemas Akropolis',
    city: 'Vilnius',
    address: 'Ozo g. 25',
    halls: 8,
    capacity: 1200,
    features: ['3D', 'IMAX']
  },
  {
    id: 'cinema-plaza',
    name: 'Cinema Plaza',
    city: 'Vilnius',
    address: 'Savanoriu pr. 24',
    halls: 7,
    capacity: 800,
    features: ['3D']
  },
  {
    id: 'skalvija-vilnius',
    name: 'Skalvija Cinema City',
    city: 'Vilnius',
    address: 'Žolyno g. 36',
    halls: 6,
    capacity: 600,
    features: ['3D', 'VIP']
  },
  
  // Kaunas
  {
    id: 'forum-kaunas',
    name: 'Forum Cinemas Mega',
    city: 'Kaunas',
    address: 'Islandijos pl. 32',
    halls: 10,
    capacity: 1500,
    features: ['IMAX', '3D', 'VIP']
  },
  {
    id: 'romuva-kaunas',
    name: 'Romuva Cinema',
    city: 'Kaunas',
    address: 'K. Donelaičio g. 76',
    halls: 3,
    capacity: 350,
    features: ['Arthouse', 'Premium']
  },
  {
    id: 'coca-cola-plaza-kaunas',
    name: 'Coca-Cola Plaza',
    city: 'Kaunas',
    address: 'Laisvės al. 87',
    halls: 8,
    capacity: 1000,
    features: ['3D', 'IMAX']
  },
  
  // Klaipėda
  {
    id: 'forum-klaipeda',
    name: 'Forum Cinemas Arena',
    city: 'Klaipėda',
    address: 'Taikos pr. 61',
    halls: 7,
    capacity: 900,
    features: ['3D', 'Premium']
  },
  {
    id: 'atlantis-klaipeda',
    name: 'Atlantis Cinema',
    city: 'Klaipėda',
    address: 'Saulės g. 15',
    halls: 5,
    capacity: 450,
    features: ['3D']
  },
  
  // Šiauliai
  {
    id: 'forum-siauliai',
    name: 'Forum Cinemas Šiauliai',
    city: 'Šiauliai',
    address: 'Aido g. 8',
    halls: 6,
    capacity: 700,
    features: ['3D', 'Premium']
  },
  
  // Panevėžys
  {
    id: 'garsas-panevezys',
    name: 'Garsas Cinema',
    city: 'Panevėžys',
    address: 'Respublikos g. 3',
    halls: 4,
    capacity: 400,
    features: ['3D']
  }
];

// Populiarūs filmų žanrai lietuviškai
export const movieGenres = [
  { id: 28, name: 'Veiksmo' },
  { id: 12, name: 'Nuotykių' },
  { id: 16, name: 'Animacija' },
  { id: 35, name: 'Komedija' },
  { id: 80, name: 'Kriminalinis' },
  { id: 99, name: 'Dokumentinis' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Šeimos' },
  { id: 14, name: 'Fantastinis' },
  { id: 36, name: 'Istorinis' },
  { id: 27, name: 'Siaubo' },
  { id: 10402, name: 'Muzikiniai' },
  { id: 9648, name: 'Mistinis' },
  { id: 10749, name: 'Romantinis' },
  { id: 878, name: 'Mokslinės fantastikos' },
  { id: 10770, name: 'TV filmas' },
  { id: 53, name: 'Trileris' },
  { id: 10752, name: 'Karo' },
  { id: 37, name: 'Vesternų' }
];

// Įprasti seansų laikai
export const commonShowtimes = [
  '10:00', '12:30', '15:00', '17:30', '20:00', '20:30', '21:00', '21:30', '22:00'
];

// Amžiaus reitingai naudojami Lietuvoje
export const ageRatings = [
  { code: 'N7', description: 'Nuo 7 metų' },
  { code: 'N13', description: 'Nuo 13 metų' },
  { code: 'N16', description: 'Nuo 16 metų' },
  { code: 'N18', description: 'Nuo 18 metų' }
];

// Pagalbinės funkcijos
export const getCinemasByCity = (city) => {
  return lithuanianCinemas.filter(cinema => 
    city ? cinema.city.toLowerCase() === city.toLowerCase() : true
  );
};

export const getCinemaById = (id) => {
  return lithuanianCinemas.find(cinema => cinema.id === id);
};

export const getAllCities = () => {
  return [...new Set(lithuanianCinemas.map(cinema => cinema.city))].sort();
};

export const searchCinemas = (query) => {
  if (!query || query.length < 2) return [];
  
  const normalizedQuery = query.toLowerCase();
  return lithuanianCinemas.filter(cinema =>
    cinema.name.toLowerCase().includes(normalizedQuery) ||
    cinema.city.toLowerCase().includes(normalizedQuery)
  );
};
