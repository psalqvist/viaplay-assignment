import axios from "axios";

// Interface for the video object that is returned from the TMDB API
interface Video {
    id: string;
    key: string;
    name: string;
    site: string;
    type: string;
}

/**
 * Fetches the URL of the trailer video for a given movie, based on its IMDb ID.
 * 
 * The function queries the API of The Movie Database (TMDb) to get information
 * about the movie's videos, and filters the results to find the trailer hosted
 * on YouTube, if available.
 * 
 * @param {string} imdbId - The IMDb ID of the movie to get the trailer for.
 * @returns {Promise<string | undefined>} A Promise that resolves to the URL of the
 *   YouTube trailer video for the movie, or undefined if no such video is found.
 */
const getTrailer = async (imdbId: string): Promise<string | undefined> => {
    try {

        // TMDB documentation: https://developers.themoviedb.org/3/movies/get-movie-videos
        const { data } = await axios.get(
          `https://api.themoviedb.org/3/movie/${imdbId}/videos?api_key=${process.env.TMDB_API_KEY}&language=en-US`
        );

        const results = data.results;
        if (!results.length) {
          return undefined;
        }
        
        const trailer = results.find(
          (video: Video) => video.type === 'Trailer' && video.site === 'YouTube'
        );
        
        if (!trailer) {
          return undefined;
        }
        
        return `https://www.youtube.com/watch?v=${trailer.key}`;
      } catch (error) {

        console.error(error);
        return undefined;
      }
}

/**
 * Fetches the IMDb ID from a Viaplay movie URL.
 *
 * @param {string} url - The URL of a Viaplay movie page.
 * @returns {Promise<string | undefined>} A Promise that resolves to the IMDb ID of the movie or series, or `undefined` if the ID cannot be found.
 */
const getImdbId = async (url: string): Promise<string | undefined> => {
    try {

        const response = await axios.get(url.toString());
        const data = response.data;

        const imdbId = data._embedded['viaplay:blocks'][0]._embedded['viaplay:product'].content.imdb.id;

        return imdbId;
      } catch (error) {

        console.error(error);
        return undefined;
      }
}

export default {
    getTrailer,
    getImdbId,
}