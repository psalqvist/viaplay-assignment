import express from 'express';

import moviesRouterV1 from './v1/movies';

const router = express.Router();

export default (): express.Router => {
    moviesRouterV1(router);

    return router;
};