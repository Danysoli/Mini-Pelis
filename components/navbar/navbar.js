/**
 * Componente de barra de navegación que maneja la navegación entre diferentes páginas y mantiene el estado del icono seleccionado.
 * 
 * Datos:
 * - currentIcon: Representa el icono actualmente seleccionado en la barra de navegación.
 * 
 * Props: 
 * - No tiene propiedades explícitas definidas.
 * 
 * Métodos:
 * - goToHome: Cambia el icono seleccionado a 'home' y navega a la página principal de inicio.
 * - goToFavorites: Cambia el icono seleccionado a 'favorites' y navega a la página de favoritos.
 * - goToGenres: Cambia el icono seleccionado a 'genres' y navega a la página de géneros.
 * 
 * didMount:
 * - Recupera el icono previamente guardado en el almacenamiento y lo establece como el icono actual al montar el componente.
 */
Component({
  data: {
    currentIcon: 'home',
  },
  props: {},
  didMount() {
    const savedIcon = my.getStorageSync({ key: 'currentIcon' }).data;
    if (savedIcon) {
      this.setData({
        currentIcon: savedIcon,
      });
    }
  },
  methods: {
    goToHome() {
      this.setData({
        currentIcon: 'home',
      });
      my.setStorageSync({
        key: 'currentIcon',
        data: 'home',
      });
      my.navigateTo({
        url: '/pages/index/index',
      });
    },

    goToFavorites() {
      this.setData({
        currentIcon: 'favorites',
      });
      my.setStorageSync({
        key: 'currentIcon',
        data: 'favorites',
      });
      my.navigateTo({
        url: '/pages/favorites/favorites',
      });
    },

    goToGenres() {
      this.setData({
        currentIcon: 'genres',
      });
      my.setStorageSync({
        key: 'currentIcon',
        data: 'genres',
      });
      my.navigateTo({
        url: '/pages/genres/genres',
      });
    }
  }
});
