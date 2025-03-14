/**
 * Página que muestra los detalles de una película o serie y permite agregarla o eliminarla de los favoritos.
 * 
 * Datos:
 * - movie: Objeto que contiene los detalles de la película o serie (título, fecha de estreno, descripción, etc.).
 * - isFavorite: Booleano que indica si la película está marcada como favorita.
 * 
 * Métodos:
 * - onLoad: Se ejecuta cuando se carga la página. Recupera el ID y el tipo de medio (película o serie) de la consulta, 
 *   y luego obtiene los detalles de la película o serie a través de la API.
 * - toggleFavorite: Se ejecuta cuando el usuario marca o desmarca la película como favorita. 
 *   Actualiza los favoritos en el almacenamiento local.
 */
const api = require("../../utils/api");

Page({
  data: {
    movie: {},
    isFavorite: false
  },

  /**
   * Método que se ejecuta al cargar la página. Obtiene los detalles de la película o serie usando el ID proporcionado.
   * 
   * @param {Object} query - Parámetros de la consulta, incluyendo 'id' y 'type' (opcional).
   */
  onLoad(query) {
    const movieId = query.id;
    const mediaType = query.type || "movie";

    console.log("Media Type:", mediaType);

    api.getMediaDetails(mediaType, movieId)
      .then((data) => {
        console.log("Detalles:", data);
        const movie = {
          id: movieId,
          mediaType,
          title: data.title || data.name,
          backdrop: `https://image.tmdb.org/t/p/w780${data.backdrop_path}`,
          release_date: data.release_date || data.first_air_date,
          overview: data.overview || "No hay descripción.",
          poster: `https://image.tmdb.org/t/p/w500${data.poster_path}`,
          vote: data.vote_average
        };

        this.setData({ movie });

        let storedFavorites = my.getStorageSync({ key: "favorites" });
        storedFavorites = storedFavorites && storedFavorites.data ? storedFavorites.data : [];

        console.log("Favoritos guardados en almacenamiento:", storedFavorites);

        // Verificar si la película está en favoritos
        let isFavorite = false;
        for (let i = 0; i < storedFavorites.length; i++) {
          if (storedFavorites[i].id === movieId) {
            isFavorite = true;
            break;
          }
        }

        this.setData({ isFavorite });
      })
      .catch((err) => {
        console.error("Error al obtener detalles:", err);
      });
  },

  /**
   * Método que alterna la película entre favoritos y no favoritos.
   * Guarda los cambios en el almacenamiento local.
   */
  toggleFavorite() {
    let storedFavorites = my.getStorageSync({ key: "favorites" });
    storedFavorites = storedFavorites && storedFavorites.data ? storedFavorites.data : [];

    const { movie, isFavorite } = this.data;

    if (isFavorite) {
      // Eliminar de favoritos
      let newFavorites = [];
      for (let i = 0; i < storedFavorites.length; i++) {
        if (storedFavorites[i].id !== movie.id) {
          newFavorites.push(storedFavorites[i]);
        }
      }
      storedFavorites = newFavorites;
    } else {
      // Agregar a favoritos
      storedFavorites.push(movie);
    }

    my.setStorageSync({
      key: "favorites",
      data: storedFavorites
    });

    console.log("Favoritos después de actualizar:", storedFavorites);

    this.setData({ isFavorite: !isFavorite });
  }
});
