import express from 'express';

import { getTrailer } from '../../controllers/v1/movies';

export default (router: express.Router) => {
  router.get('/v1/movies/trailer', getTrailer);
};