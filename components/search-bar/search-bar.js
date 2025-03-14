/**
 * Componente de sugerencias de búsqueda que filtra las películas según la entrada del usuario.
 * 
 * Props: 
 * - movies: Lista de películas que se utilizará para realizar las sugerencias. Es un array.
 * - onSelectSuggestion: Función que se ejecutará cuando el usuario seleccione una sugerencia.
 * 
 * Datos:
 * - query: Cadena de texto que contiene la consulta actual del usuario.
 * - suggestions: Lista de sugerencias basadas en la consulta del usuario.
 * 
 * Métodos:
 * - onInput: Se ejecuta cuando el usuario escribe en el campo de búsqueda. Filtra las películas según el título y actualiza las sugerencias.
 * - selectSuggestion: Se ejecuta cuando el usuario selecciona una sugerencia. Llama a la función `onSelectSuggestion` con los parámetros id y mediaType.
 * - clearSearch: Limpia el campo de búsqueda y las sugerencias.
 */
Component({
  props: {
    movies: {
      type: Array,
      value: []
    },
    onSelectSuggestion: () => {},
  },

  data: {
    query: "",
    suggestions: []
  },

  methods: {
    onInput(event) {
      const query = event.detail.value.trim().toLowerCase();
      this.setData({ query });

      if (query.length < 2) {
        this.setData({ suggestions: [] });
        return;
      }

      // Filtrar dentro de this.properties.movies
      const filteredResults = this.props.movies.filter((item) =>
        item.title.toLowerCase().includes(query)
      );

      this.setData({ 
        suggestions: filteredResults.slice(0, 5)
      });
    },

    selectSuggestion(event) {
      const id = event.currentTarget.dataset.id;
      const mediaType = event.currentTarget.dataset.mediaType;
      
      if (this.props.onSelectSuggestion) {
        this.props.onSelectSuggestion(id, mediaType);
      }
    },

    clearSearch() {
      this.setData({ query: "", suggestions: [] });
    }
  }
});
