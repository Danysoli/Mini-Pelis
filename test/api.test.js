// tests/api.test.js

// Simula `my` globalmente para que Jest lo reconozca en todas las pruebas
global.my = {
  request: jest.fn(),
};

// Importa las funciones que deseas probar
const { getTrendingMovies, getMediaDetails, getMediaByGenre } = require("../utils/api");

describe('API tests', () => {
  beforeEach(() => {
    // Limpiar cualquier llamada anterior a `my.request` antes de cada prueba
    my.request.mockClear();
  });

  test('debería obtener las películas en tendencia correctamente', async () => {
    // Simula una respuesta exitosa con datos de películas en tendencia
    my.request.mockImplementationOnce(({ success }) => 
      success({
        statusCode: 200,
        data: { 
          results: [
            { id: 1, title: 'Película 1', poster_path: '/path1.jpg', media_type: 'movie', genre_ids: [28] },
            { id: 2, title: 'Película 2', poster_path: '/path2.jpg', media_type: 'movie', genre_ids: [12] }
          ]
        }
      })
    );

    const peliculas = await getTrendingMovies();

    // Verifica que las películas se hayan obtenido correctamente
    expect(peliculas).toEqual([
      { id: 1, title: 'Película 1', poster: 'https://image.tmdb.org/t/p/w500/path1.jpg', mediaType: 'movie', genre: [28] },
      { id: 2, title: 'Película 2', poster: 'https://image.tmdb.org/t/p/w500/path2.jpg', mediaType: 'movie', genre: [12] }
    ]);
    expect(my.request).toHaveBeenCalledWith(expect.objectContaining({
      url: 'https://api.themoviedb.org/3/trending/all/day',
      method: 'GET',
    }));
  });

  test('debería manejar errores al obtener las películas en tendencia', async () => {
    // Simula un error en la API
    my.request.mockImplementationOnce(({ fail }) => 
      fail({
        statusCode: 500,
        message: 'Error en el servidor'
      })
    );

    const peliculas = await getTrendingMovies();

    // Verifica que, en caso de error, el array de películas sea vacío
    expect(peliculas).toEqual([]);
    expect(my.request).toHaveBeenCalledWith(expect.objectContaining({
      url: 'https://api.themoviedb.org/3/trending/all/day',
      method: 'GET',
    }));
  });

  test('debería obtener los detalles de una película correctamente', async () => {
    // Simula una respuesta exitosa con los detalles de una película
    my.request.mockImplementationOnce(({ success }) => 
      success({
        statusCode: 200,
        data: { id: 1, title: 'Película 1', overview: 'Descripción de la película', genre_ids: [28] }
      })
    );

    const detalles = await getMediaDetails('movie', 1);

    // Verifica que los detalles de la película se hayan obtenido correctamente
    expect(detalles).toEqual({ id: 1, title: 'Película 1', overview: 'Descripción de la película', genre_ids: [28] });
    expect(my.request).toHaveBeenCalledWith(expect.objectContaining({
      url: 'https://api.themoviedb.org/3/movie/1',
      method: 'GET',
    }));
  });

  test('debería manejar errores al obtener los detalles de la película', async () => {
    // Simula un error de tipo de medio no válido
    const error = await getMediaDetails('unknown', 1).catch(e => e);

    // Verifica que el error sea el esperado
    expect(error.message).toBe('Tipo de medio no válido');
  });

  test('debería obtener las películas y series de un género correctamente', async () => {
    // Simula una respuesta exitosa con películas y series del género
    my.request.mockImplementationOnce(({ success }) => 
      success({
        statusCode: 200,
        data: { results: [{ id: 1, title: 'Película 1', poster_path: '/path1.jpg', media_type: 'movie', genre_ids: [28] }] }
      })
    ).mockImplementationOnce(({ success }) => 
      success({
        statusCode: 200,
        data: { results: [{ id: 2, title: 'Serie 1', poster_path: '/path2.jpg', media_type: 'tv', genre_ids: [28] }] }
      })
    );

    const medios = await getMediaByGenre(28, 1);

    // Verifica que las películas y series se hayan combinado correctamente
    expect(medios).toEqual([
      { id: 1, title: 'Película 1', poster: 'https://image.tmdb.org/t/p/w500/path1.jpg', mediaType: 'movie', genre: [28] },
      { id: 2, title: 'Serie 1', poster: 'https://image.tmdb.org/t/p/w500/path2.jpg', mediaType: 'tv', genre: [28] }
    ]);
    expect(my.request).toHaveBeenCalledWith(expect.objectContaining({
      url: 'https://api.themoviedb.org/3/discover/movie',
      method: 'GET',
    }));
    expect(my.request).toHaveBeenCalledWith(expect.objectContaining({
      url: 'https://api.themoviedb.org/3/discover/tv',
      method: 'GET',
    }));
  });

  test('debería manejar errores al obtener los medios de un género', async () => {
    // Simula un error en la API al obtener los medios
    my.request.mockImplementationOnce(({ fail }) => 
      fail({
        statusCode: 500,
        message: 'Error en el servidor'
      })
    );

    const medios = await getMediaByGenre(28, 1);

    // Verifica que, en caso de error, se devuelvan un array vacío
    expect(medios).toEqual([]);
  });
});
