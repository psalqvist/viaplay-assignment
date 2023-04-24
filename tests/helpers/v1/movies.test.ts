/**
 *  Unit tests for the movie helper functions
 */

import nock from 'nock';
import movieHelper from '../../../src/helpers/v1/movies';

describe('getImdbId()', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('should return the IMDb ID of a movie', async () => {
    const viaplayMovieUrl = 'https://test.viaplay.movie.com/movie/test-2022';
    const mockedResponse = {
      _embedded: {
        'viaplay:blocks': [
          {
            _embedded: {
              'viaplay:product': {
                content: {
                  imdb: {
                    id: 'tt1234567',
                  },
                },
              },
            },
          },
        ],
      },
    };

    nock('https://test.viaplay.movie.com')
      .get('/movie/test-2022')
      .reply(200, mockedResponse);

    const imdbId = await movieHelper.getImdbId(viaplayMovieUrl);
    expect(imdbId).toEqual('tt1234567');
  });

  it('should return undefined if the IMDb ID cannot be found', async () => {
    const viaplayInvalidUrl = 'https://test.viaplay.movie.com/movie/invalid-url-2022';

    nock('https://test.viaplay.movie.com')
      .get('/movie/invalid-url-2022')
      .reply(404);

    const imdbId = await movieHelper.getImdbId(viaplayInvalidUrl);
    expect(imdbId).toBeUndefined();
  });
});

describe('getTrailer()', () => {  
    afterEach(() => {
      nock.cleanAll();
    });
  
    it('should return the YouTube trailer URL for a given IMDb ID', async () => {
      const imdbId = 'tt1234567';
      const tmdbApiKey = 'your-tmdb-api-key';
      process.env.TMDB_API_KEY = tmdbApiKey;
  
      const mockVideoData = {
        results: [
          {
            id: '12345',
            key: 'trailerKey',
            name: 'Movie Trailer',
            site: 'YouTube',
            type: 'Trailer',
          },
        ],
      };
  
      nock('https://api.themoviedb.org')
        .get(`/3/movie/${imdbId}/videos`)
        .query({ api_key: tmdbApiKey, language: 'en-US' })
        .reply(200, mockVideoData);
  
      const trailerUrl = await movieHelper.getTrailer(imdbId);
      expect(trailerUrl).toBe('https://www.youtube.com/watch?v=trailerKey');
    });
  
    it('should return undefined if no YouTube trailer is found for a given IMDb ID', async () => {
      const imdbId = 'tt1234567';
      const tmdbApiKey = 'your-tmdb-api-key';
      process.env.TMDB_API_KEY = tmdbApiKey;
  
      const mockVideoData = {
        results: [{}],
      };
  
      nock('https://api.themoviedb.org')
        .get(`/3/movie/${imdbId}/videos`)
        .query({ api_key: tmdbApiKey, language: 'en-US' })
        .reply(200, mockVideoData);
  
      const trailerUrl = await movieHelper.getTrailer(imdbId);
      expect(trailerUrl).toBeUndefined();
    });
  
    it('should return undefined if an error occurs while fetching data from the TMDb API', async () => {
      const imdbId = 'tt1234567';
      const tmdbApiKey = 'your-tmdb-api-key';
      process.env.TMDB_API_KEY = tmdbApiKey;
  
      nock('https://api.themoviedb.org')
        .get(`/3/movie/${imdbId}/videos`)
        .query({ api_key: tmdbApiKey, language: 'en-US' })
        .reply(500);
  
      const trailerUrl = await movieHelper.getTrailer(imdbId);
      expect(trailerUrl).toBeUndefined();
    });
  });