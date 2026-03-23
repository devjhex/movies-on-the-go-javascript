export const apiKey = '9669f3c4a020adb344371306e3fd4811';
export const imageUrl = `https://image.tmdb.org/t/p/w342`;
export const backdropUrl = `https://image.tmdb.org/t/p/w1280`;

export const moviesUpcomingUrl = `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&language=en-US&page=1`;
export const top_ratedUrl = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=en-US&page=1`;
export const tvShowsUpcomingUrl = `https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}&language=en-US&page=1`;
export const animeUpcomingUrl = `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&language=en-US&with_genres=16&page=1`;

export async function fetchAndExecute(endpoints, callbacks, customFunctions = [], customFunctionArguments = {}) {
    if(endpoints.length !== callbacks.length) throw new Error('Endpoints and callbacks must be the same length.');
    const responses = await Promise.all(endpoints.map(endpoint => fetch(endpoint)));
    const data = await Promise.all(responses.map(response => response.json()));
    data.forEach((result, index) => callbacks[index](result));
    customFunctions.forEach(func => func(customFunctionArguments[func.name]));
}
