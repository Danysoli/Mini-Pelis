/**
 * Página principal que muestra las películas más populares.
 * 
 * Esta página muestra las películas más populares obtenidas desde una API.
 * También tiene la funcionalidad de navegar a los detalles de una película cuando se selecciona una sugerencia.
 */
const api = require("../../utils/api");

Page({
  data: {
    // Lista de películas populares
    movies: [],
    // Lista de películas filtradas (inicialmente es igual a todas las películas)
    filteredMovies: []
  },

  /**
   * Se ejecuta cuando la página se carga.
   * Obtiene las películas populares a través de la API y actualiza el estado de la página.
   */
  onLoad() {
    my.setStorageSync({
      key: 'currentIcon',
      data: 'home',
    });

    api.getTrendingMovies().then((movies) => {
      console.log("movies", movies);
      this.setData({ 
        movies,
        filteredMovies: movies // Inicialmente mostrar todas las películas
      });
    }).catch((err) => {
      console.error("Error al obtener películas:", err);
    });
  },

  /**
   * Función que maneja la selección de una sugerencia.
   * Navega a la página de detalles de la película seleccionada.
   * 
   * @param {string} id - El ID de la película.
   * @param {string} mediaType - El tipo de medio (por ejemplo, 'movie').
   */
  onSelectSuggestion(id, mediaType) {
    my.navigateTo({
      url: `/pages/detail/detail?id=${id}&type=${mediaType}`
    });
  }
});
