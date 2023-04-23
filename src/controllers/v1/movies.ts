import express from 'express';
import movieHelper from '../../helpers/v1/movies';

/**
 * Retrieve the trailer URL for a given movie resource.
 * 
 * @param req The express Request object.
 * @param res The express Response object.
 * 
 * @returns {Response} The HTTP response containing the trailer URL and whether the request was successful.
 * 
 * @example
 * GET /v1/movies/trailer?url=https://content.viaplay.se/pc-se/film/arrival-2016
 */ 
export const getTrailer = async (req: express.Request, res: express.Response) => {
  try {
    const { url } = req.query;

    // fetch the imdb id from the given resourceLink: `url`
    let imdbId;
    if (url) {
        imdbId = await movieHelper.getImdbId(url.toString());
    } else {
        return res.status(400).send({
            success: false,
            error: 'Missing required parameter: url',
        });
    }

    // fetch the trailer url from imdb id
    let trailerUrl;
    if (imdbId) {
        trailerUrl = await movieHelper.getTrailer(imdbId);
    } else {
        return res.status(400).send({
            success: false,
            error: 'Could not find imdb id for the given url',
        });
    }

    return res.status(200).send({
        success: true,
        trailerUrl: trailerUrl,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).send({
        success: false,
        error: 'Internal server error',
    });
  }
};