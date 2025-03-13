// Definimos la URL base de la API de TMDb (The Movie Database) y la clave de acceso a la API.
const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = "fb0493c49e8bd92ca74b49144c43020e"; // ⚠️ Mantén tu clave segura

/**
 * Realiza una petición GET a la API de TMDb.
 * 
 * @param {string} endpoint - El endpoint específico de la API al que se realiza la solicitud (por ejemplo: "trending/all/day").
 * @param {object} params - Parámetros adicionales para la consulta, como parámetros de paginación o filtros.
 * @returns {Promise<Object>} - Promesa que resuelve con los datos de la respuesta de la API o lanza un error.
 */
const fetchData = (endpoint, params = {}) => {
  return new Promise((resolve, reject) => {
    // Realizamos una solicitud GET usando la URL base, el endpoint y los parámetros.
    my.request({
      url: `${BASE_URL}/${endpoint}`,
      method: "GET",
      data: { api_key: API_KEY, language: "es-BO", ...params },
      success: (res) => {
        // Verificamos si la respuesta tiene un código de estado exitoso (200-299).
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data);  // Si la solicitud fue exitosa, resolvemos la promesa con los datos.
        } else {
          console.error(`Error en la API (status: ${res.statusCode})`, res);
          reject(new Error(`Error en la API: Código ${res.statusCode}`)); // Si la respuesta es incorrecta, rechazamos la promesa.
        }
      },
      fail: (err) => {
        console.error("Error en la petición a la API:", err);
        reject(new Error("Error en la API: No se pudo conectar")); // Si hay un fallo en la conexión, rechazamos la promesa.
      },
    });
  });
};

/**
 * Obtiene las películas que están en tendencia actualmente, hasta un máximo de la página 5.
 * 
 * @returns {Promise<Array<Object>>} - Promesa que resuelve con una lista de objetos de películas (cada uno con detalles como id, título y poster).
 */
const getTrendingMovies = async () => {
  let movies = [];  // Inicializamos un array vacío para almacenar las películas.

  // Realizamos solicitudes a las páginas 1 hasta 5 para obtener las películas en tendencia.
  for (let page = 1; page <= 5; page++) {
    try {
      // Llamamos a la función fetchData para obtener los datos de la API para la página actual.
      const data = await fetchData("trending/all/day", { page });
      
      // Formateamos los resultados de la API para simplificar los datos.
      const formattedMovies = data.results.map((item) => ({
        id: item.id,  // ID de la película o serie.
        title: item.title || item.name,  // Título de la película (puede ser 'title' o 'name').
        poster: `https://image.tmdb.org/t/p/w500${item.poster_path}`,  // URL de la imagen del póster.
        mediaType: item.media_type,  // Tipo de medio (película o serie).
        genre: item.genre_ids  // Géneros asociados a la película.
      }));

      // Agregamos los resultados formateados al array de películas.
      movies = [...movies, ...formattedMovies];
    } catch (error) {
      console.error(`Error al obtener la página ${page}:`, error);
    }
  }

  return movies;  // Devolvemos la lista de películas obtenidas.
};

/**
 * Obtiene los detalles de una película o serie en particular.
 * 
 * @param {string} mediaType - El tipo de medio ('movie' o 'tv').
 * @param {number} mediaId - El ID del medio (película o serie) que se desea consultar.
 * @returns {Promise<Object>} - Promesa que resuelve con los detalles del medio o lanza un error si el tipo es inválido.
 */
const getMediaDetails = (mediaType, mediaId) => {
  // Verificamos si el tipo de medio es válido (puede ser 'movie' o 'tv').
  if (!["movie", "tv"].includes(mediaType)) {
    return Promise.reject(new Error("Tipo de medio no válido"));  // Si el tipo no es válido, rechazamos la promesa.
  }

  // Llamamos a la función fetchData para obtener los detalles del medio específico usando su ID.
  return fetchData(`${mediaType}/${mediaId}`, {});
};

/**
 * Obtiene películas y series de un género específico.
 * 
 * @param {number} genreId - El ID del género (por ejemplo, 28 para 'Acción').
 * @param {number} page - La página de resultados a consultar (opcional, predeterminado es 1).
 * @returns {Promise<Array<Object>>} - Promesa que resuelve con una lista de películas y series del género solicitado.
 */
const getMediaByGenre = async (genreId, page = 1) => {
  try {
    // Llamamos a fetchData para obtener las películas del género especificado.
    const movieData = await fetchData("discover/movie", { with_genres: genreId, page });
    const movies = movieData.results.map((item) => ({
      id: item.id,  // ID de la película.
      title: item.title || item.name,  // Título de la película.
      poster: `https://image.tmdb.org/t/p/w500${item.poster_path}`,  // URL del póster de la película.
      mediaType: "movie",  // Establecemos el tipo como 'movie'.
      genre: item.genre_ids  // Géneros asociados a la película.
    }));

    // Llamamos a fetchData para obtener las series del género especificado.
    const tvData = await fetchData("discover/tv", { with_genres: genreId, page });
    const tvShows = tvData.results.map((item) => ({
      id: item.id,  // ID de la serie.
      title: item.title || item.name,  // Título de la serie.
      poster: `https://image.tmdb.org/t/p/w500${item.poster_path}`,  // URL del póster de la serie.
      mediaType: "tv",  // Establecemos el tipo como 'tv'.
      genre: item.genre_ids  // Géneros asociados a la serie.
    }));

    // Combinamos las películas y series en un solo array.
    return [...movies, ...tvShows];
  } catch (error) {
    console.error("Error al obtener contenido por género:", error);
    return [];  // Si ocurre un error, devolvemos un array vacío.
  }
};

// Exportamos las funciones para que puedan ser utilizadas en otros módulos.
module.exports = {
  getTrendingMovies,
  getMediaDetails,
  getMediaByGenre
};
