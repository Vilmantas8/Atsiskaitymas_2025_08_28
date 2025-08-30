// TMDB API servisas
// Registruokitės nemokamam API raktui: https://www.themoviedb.org/settings/api

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
// Jums reikia registruotis ir gauti savo API raktą
const TMDB_API_KEY = 'your-tmdb-api-key-here'; // Pakeiskite tikru API raktu

class TMDBService {
  // Ieškoti filmų
  async searchMovies(query, page = 1) {
    try {
      if (!query || query.length < 2) return { results: [] };
      
      const response = await fetch(
        `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${page}&language=en-US`
      );
      
      if (!response.ok) {
        throw new Error(`TMDB API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error searching movies:', error);
      return { results: [] };
    }
  }

  // Gauti populiarius filmus
  async getPopularMovies(page = 1) {
    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&page=${page}&language=en-US`
      );
      
      if (!response.ok) {
        throw new Error(`TMDB API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting popular movies:', error);
      return { results: [] };
    }
  }

  // Gauti filmo detales
  async getMovieDetails(movieId) {
    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=en-US`
      );
      
      if (!response.ok) {
        throw new Error(`TMDB API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting movie details:', error);
      return null;
    }
  }

  // Gauti dabar rodomų filmų sąrašą
  async getNowPlayingMovies(page = 1) {
    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/movie/now_playing?api_key=${TMDB_API_KEY}&page=${page}&language=en-US`
      );
      
      if (!response.ok) {
        throw new Error(`TMDB API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting now playing movies:', error);
      return { results: [] };
    }
  }

  // Gauti būsimų filmų sąrašą
  async getUpcomingMovies(page = 1) {
    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/movie/upcoming?api_key=${TMDB_API_KEY}&page=${page}&language=en-US`
      );
      
      if (!response.ok) {
        throw new Error(`TMDB API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting upcoming movies:', error);
      return { results: [] };
    }
  }

  // Pagalbinis metodas gauti pilną paveikslėlio URL
  getImageUrl(imagePath, size = 'w500') {
    if (!imagePath) return null;
    return `https://image.tmdb.org/t/p/${size}${imagePath}`;
  }

  // Formatuoti filmo duomenis mūsų programai
  formatMovieForBooking(movie) {
    return {
      id: movie.id,
      title: movie.title,
      originalTitle: movie.original_title,
      overview: movie.overview,
      releaseDate: movie.release_date,
      genres: movie.genres || [],
      runtime: movie.runtime,
      posterUrl: this.getImageUrl(movie.poster_path),
      backdropUrl: this.getImageUrl(movie.backdrop_path),
      voteAverage: movie.vote_average,
      voteCount: movie.vote_count
    };
  }

  // Patikrinti, ar API raktas sukonfigūruotas
  isConfigured() {
    return TMDB_API_KEY && TMDB_API_KEY !== 'your-tmdb-api-key-here';
  }

  // Gauti konfigūracijos informaciją
  getApiInfo() {
    return {
      configured: this.isConfigured(),
      baseUrl: TMDB_BASE_URL,
      hasApiKey: !!TMDB_API_KEY,
      keyFormat: TMDB_API_KEY ? `${TMDB_API_KEY.substring(0, 8)}...` : 'Not set'
    };
  }
}

// Sukurti ir eksportuoti singleton egzempliorių
const tmdbService = new TMDBService();
export default tmdbService;

// Alternatyvūs nemokamų filmų duomenys kūrimo/testavimo tikslams
export const sampleMovieData = [
  {
    id: 1,
    title: 'Mūsų vestuvės',
    originalTitle: 'The Wedding',
    overview: 'Romantinė komedija apie neįtikėtinas vestuves',
    releaseDate: '2025-01-15',
    genres: [{ id: 35, name: 'Komedija' }, { id: 10749, name: 'Romantinis' }],
    runtime: 108,
    voteAverage: 7.2
  },
  {
    id: 2,
    title: 'Vilniaus paslaptys',
    originalTitle: 'Secrets of Vilnius',
    overview: 'Trileris apie paslaptingas Vilniaus gatves',
    releaseDate: '2025-02-01',
    genres: [{ id: 53, name: 'Trileris' }, { id: 9648, name: 'Mistinis' }],
    runtime: 95,
    voteAverage: 8.1
  },
  {
    id: 3,
    title: 'Lietuvos legendos',
    originalTitle: 'Lithuanian Legends',
    overview: 'Fantastinis filmas apie lietuvių mitologiją',
    releaseDate: '2025-02-14',
    genres: [{ id: 14, name: 'Fantastinis' }, { id: 12, name: 'Nuotykių' }],
    runtime: 125,
    voteAverage: 7.8
  }
];
