/**
 * Componente de género que permite la navegación a una página de filtrado por género.
 * 
 * Props:
 * - id: Número que representa el identificador del género.
 * - name: Cadena de texto con el nombre del género.
 * 
 * Métodos:
 * - goToGenre: Navega a la página de filtrado de géneros con los parámetros correspondientes.
 */
Component({
  props: {
    id: Number,
    name: String
  },
  methods: {
    goToGenre() {
      console.log("Seleccionaste el género:", this.props.name);
      my.navigateTo({
        url: `/pages/genre-filter/genre-filter?genreId=${this.props.id}&genreName=${this.props.name}`
      });
    }
  }
});
