export const apiKey = '9669f3c4a020adb344371306e3fd4811';
export const imageUrl = `https://image.tmdb.org/t/p/w342`;
export const backdropUrl = `https://image.tmdb.org/t/p/w1280`;
const base = 'https://image.tmdb.org/t/p';

export function posterSrcset(path) {
    return `${base}/w185${path} 185w, ${base}/w342${path} 342w, ${base}/w500${path} 500w`;
}
export function backdropSrcset(path) {
    return `${base}/w780${path} 780w, ${base}/w1280${path} 1280w`;
}
export function profileSrcset(path) {
    return `${base}/w185${path} 185w, ${base}/h632${path} 632w`;
}

export const moviesUpcomingUrl = `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&language=en-US&page=1`;
export const top_ratedUrl = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=en-US&page=1`;
export const tvShowsUpcomingUrl = `https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}&language=en-US&page=1`;
export const animeUpcomingUrl = `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&language=en-US&with_genres=16&page=1`;

export function trapFocus(event, firstFocusableElement, lastFocusableElement) {
    if (event.key === 'Tab' && !event.shiftKey) {
        if (document.activeElement === lastFocusableElement) {
            event.preventDefault();
            firstFocusableElement.focus();
        }
    } else if (event.key === 'Tab' && event.shiftKey) {
        if (document.activeElement === firstFocusableElement) {
            event.preventDefault();
            lastFocusableElement.focus();
        }
    }
}

export async function fetchAndExecute(endpoints, callbacks, customFunctions = [], customFunctionArguments = {}) {
    if(endpoints.length !== callbacks.length) throw new Error('Endpoints and callbacks must be the same length.');
    const responses = await Promise.all(endpoints.map(endpoint => fetch(endpoint)));
    const data = await Promise.all(responses.map(response => response.json()));
    data.forEach((result, index) => callbacks[index](result));
    customFunctions.forEach(func => func(customFunctionArguments[func.name]));
}
