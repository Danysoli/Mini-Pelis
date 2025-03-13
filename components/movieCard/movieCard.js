/**
 * Componente de tarjeta de medio que permite la navegación a la página de detalles.
 * 
 * Props:
 * - id: Número que representa el identificador del medio.
 * - mediaType: Cadena que indica el tipo de medio (película, serie, etc.).
 * - title: Cadena con el título del medio.
 * - poster: URL de la imagen del póster del medio.
 * 
 * Métodos:
 * - goToDetail: Navega a la página de detalles del medio seleccionado con los parámetros correspondientes.
 */
Component({
  props: {
    id: Number,
    mediaType: String,
    title: String,
    poster: String
  },
  methods: {
    goToDetail() {
      console.log("hola", this.props.id, "tipo:", this.props.mediaType);
      my.navigateTo({
        url: `/pages/detail/detail?id=${this.props.id}&type=${this.props.mediaType}`
      });
    }
  }
});
