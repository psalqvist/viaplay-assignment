import request from 'supertest';
import express from 'express';
import nock from 'nock';
import movieRoutes from '../../../src/routes/v1/movies';

const app = express();
app.use(express.json());
movieRoutes(app);

beforeAll(() => {
  nock('https://content.viaplay.se')
    .get('/pc-se/film/arrival-2016')
    .reply(200, {
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
    });

  nock('https://api.themoviedb.org')
    .get('/3/movie/tt1234567/videos')
    .query({ api_key: process.env.TMDB_API_KEY, language: 'en-US' }) // Replace with a dummy API key
    .reply(200, {
      results: [
        {
          key: 'trailerKey',
          site: 'YouTube',
          type: 'Trailer',
          id: '12345',
          name: 'Movie Trailer',
        },
      ],
    });
});

describe('GET /v1/movies/trailer Integration Test', () => {
  it('should return 200 with the trailer URL when provided with a valid movie URL', async () => {
    const res = await request(app)
      .get('/v1/movies/trailer')
      .query({ url: 'https://content.viaplay.se/pc-se/film/arrival-2016' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('trailerUrl', 'https://www.youtube.com/watch?v=trailerKey');
  });

  it('should return 400 when the url parameter is missing', async () => {
    const res = await request(app)
      .get('/v1/movies/trailer')
      .query({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('error', 'Missing required parameter: url');
  });

  it('should return 400 when the provided movie URL does not have an IMDb ID', async () => {
    nock('https://content.viaplay.se')
      .get('/pc-se/film/invalid-url')
      .reply(200, {
        _embedded: {
          'viaplay:blocks': [
            {
              _embedded: {
                'viaplay:product': {
                  content: {},
                },
              },
            },
          ],
        },
      });

    const res = await request(app)
      .get('/v1/movies/trailer')
      .query({ url: 'https://content.viaplay.se/pc-se/film/invalid-url' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('error', 'Could not find imdb id for the given url');
  });
});