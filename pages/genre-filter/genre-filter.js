/**
 * Página que muestra las películas de un género específico.
 * 
 * Datos:
 * - genreId: ID del género seleccionado.
 * - genreName: Nombre del género seleccionado.
 * - movies: Lista de películas que pertenecen al género seleccionado.
 * 
 * Métodos:
 * - onLoad: Se ejecuta cuando se carga la página. Recupera los parámetros del género (ID y nombre) y carga las películas relacionadas.
 * - loadMovies: Método asincrónico que obtiene las películas del género seleccionado usando la API y las guarda en el estado.
 */
const { getMediaByGenre } = require("../../utils/api");

Page({
  data: {
    genreId: null,
    genreName: "",
    movies: []
  },

  /**
   * Método que se ejecuta al cargar la página. Recupera el ID y el nombre del género desde los parámetros de la consulta.
   * Luego, carga las películas del género seleccionado.
   * 
   * @param {Object} query - Parámetros de la consulta, incluyendo 'genreId' y 'genreName'.
   */
  onLoad(query) {
    const { genreId, genreName } = query;
    this.setData({ genreId, genreName });
    this.loadMovies(genreId);
  },

  /**
   * Método asincrónico que obtiene las películas del género seleccionado utilizando la API y actualiza el estado.
   * 
   * @param {string} genreId - El ID del género para obtener las películas correspondientes.
   */
  async loadMovies(genreId) {
    const movies = await getMediaByGenre(genreId);
    console.log("Género", movies);
    this.setData({ movies });
  }
});
