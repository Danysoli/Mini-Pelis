/**
 * Página que muestra las películas favoritas almacenadas por el usuario.
 * 
 * Datos:
 * - favoriteMovies: Lista de películas que el usuario ha agregado a sus favoritos.
 * 
 * Métodos:
 * - onShow: Se ejecuta cuando la página es visible. Recupera las películas favoritas del almacenamiento y actualiza el estado.
 */
Page({
  data: {
    favoriteMovies: []
  },

  /**
   * Método que se ejecuta cuando la página se vuelve visible. Recupera las películas favoritas del almacenamiento local
   * y actualiza el estado con la lista de favoritos.
   */
  onShow() {
    let storedFavorites = my.getStorageSync({ key: "favorites" });
    storedFavorites = storedFavorites && storedFavorites.data ? storedFavorites.data : [];

    console.log("📌 Películas en favoritos:", storedFavorites);

    // Actualizar el estado con las películas favoritas
    this.setData({ favoriteMovies: storedFavorites });
  }
});
