import { apiKey, imageUrl, posterSrcset, profileSrcset } from "./api.js";
import { loadSharedComponents } from "./common.js";

loadSharedComponents();

const searchBar = document.querySelector('.search-bar');
const searchButton = document.querySelectorAll('.search-button');
const closeButton = document.querySelector('.closeSearchModalBtn');
const summaryResultsContainer = document.querySelector('.summaryResults');
const searchResultsText = document.querySelector(".searchResultsText");
let types = summaryResultsContainer.querySelectorAll('li');
let movieResultsContainer = document.querySelector(".search-results-container");
let imageElements = movieResultsContainer.querySelectorAll('img');
let borderSlider = document.querySelector('.borderSlider');
const resultsContainer = document.querySelector('.search-results-container');

closeButton.addEventListener('click', () => { searchBar.value = ''; });

searchButton.forEach(button => {
    button.addEventListener('click', (event) => {
        let btn = event.currentTarget.closest('button');
        if (btn) {
            let input = btn.parentElement.querySelector('.search-bar');
            const query = input.value.trim();
            if (query) {
                const baseURL = `${window.location.protocol}//${window.location.host}`;
                if (window.location.host.includes('localhost') || window.location.hostname === "127.0.0.1") {
                    window.location.href = `${baseURL}/docs/search.html?query=${encodeURIComponent(query)}`;
                } else {
                    window.location.href = `${baseURL}/search.html?query=${encodeURIComponent(query)}`;
                }
            }
        }
    });
});

const query = getQueryParameter("query");
if (query) {
    fetchSearchResults(query);
} else {
    resultsContainer.innerHTML = `<h1 class="text-[1.9rem] font-[700] p-4 mx-auto">You haven't searched for any movies!!</h1>`;
}

function getQueryParameter(queryName) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(queryName);
}

async function fetchSearchResults(query) {
    try {
        const [multiResults, collectionResults, keywordResults] = await Promise.all([
            fetch(`https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${encodeURIComponent(query)}`).then(r => r.json()),
            fetch(`https://api.themoviedb.org/3/search/collection?api_key=${apiKey}&query=${encodeURIComponent(query)}`).then(r => r.json()),
            fetch(`https://api.themoviedb.org/3/search/keyword?api_key=${apiKey}&query=${encodeURIComponent(query)}`).then(r => r.json()),
        ]);

        const [movies, tvs, people, collections, keywords] = [
            filterResults(multiResults.results, 'movie'),
            filterResults(multiResults.results, 'tv'),
            filterResults(multiResults.results, 'person'),
            collectionResults.results,
            keywordResults.results
        ];

        renderSearchResults(movies, "movie");
        updateResultText();
        updateSearchBar();
        updateSearchResults(movies, tvs, people, collections, keywords);
        addImageListeners(imageElements);

        types.forEach(mediaType => {
            mediaType.addEventListener('click', (event) => {
                let clickedTab = event.currentTarget;
                let type = clickedTab.getAttribute('data-type');

                if (type === 'movie') renderSearchResults(movies, 'movies');
                else if (type === "tv") renderSearchResults(tvs, 'tv-shows');
                else if (type === "person") renderSearchResults(people, 'people');
                else if (type === "collection") renderSearchResults(collections, "collections");
                else if (type === "keywords") renderSearchResults(keywords, 'keywords');

                switchTab(clickedTab, types);
                moveIndicator(borderSlider, clickedTab);
            });
        });

    } catch (error) {
        console.error('Error Fetching Results', error);
    }
}

function renderSearchResults(movies, type) {
    const resultsContainer = document.querySelector('.search-results-container');
    if (movies.length < 1) {
        resultsContainer.innerHTML = `<h1 class="text-[1.9rem] font-[700] p-4 mx-auto">There are no ${type} that matched your query.</h1>`;
        return;
    }
    resultsContainer.innerHTML = movies.map((movie) => {
        if (movie.media_type === "movie") {
            let currentPosterImage = movie.poster_path ? `${imageUrl}${movie.poster_path}` : 'images/logo.png';
            return `<article class="movieListItem w-full h-[150px] flex gap-[.5rem] text-[#f8B319] border border-[#ffb319] movie cursor-pointer" data-id="${movie.id}">
                <div class="w-[100px] shrink-0 relative flex items-center justify-center">
                    <div class="bg-black w-full h-full top-0 left-0 border border-[#ffb319] absolute flex items-center justify-center z-30 animate-imageHolder loading">
                        <img class="w-[50px]" src="images/logo.png" alt="Honey movies logo">
                    </div>
                    <img class="${movie.poster_path ? 'h-full' : ''}" src="${currentPosterImage}" srcset="${movie.poster_path ? posterSrcset(movie.poster_path) : ''}" sizes="100px" alt="${movie.title}" onload="this.closest('article').querySelector('.loading').classList.add('invisible')">
                </div>
                <div class="summaryDescription">
                    <h1 class="text-[1.4rem] font-bold line-clamp-1">${movie.title}</h1>
                    <div class="flex gap-[1.2rem] text-[#ffb219a1]"><span>${movie.release_date}</span></div>
                    <div class="w-[95%] mt-2 flex items-center gap-[.5rem] text-[#ffb219a1]"><span class="block line-clamp-3">${movie.overview}</span></div>
                </div>
            </article>`;
        } else if (movie.media_type === "person") {
            let currentProfileImage = movie.profile_path ? `${imageUrl}${movie.profile_path}` : 'images/logo.png';
            return `<article class="movieListItem w-full h-[150px] flex gap-[.5rem] text-[#f8B319] border border-[#ffb319] person cursor-pointer" data-id="${movie.id}">
                <div class="w-[100px] flex items-center justify-center shrink-0 relative">
                    <div class="bg-black w-full h-full top-0 left-0 border border-[#ffb319] absolute flex items-center justify-center z-30 animate-imageHolder loading">
                        <img class="w-[50px]" src="images/logo.png" alt="Honey movies logo">
                    </div>
                    <img class="${movie.profile_path ? 'h-full' : ''}" src="${currentProfileImage}" srcset="${movie.profile_path ? profileSrcset(movie.profile_path) : ''}" sizes="100px" alt="${movie.name}" onload="this.closest('article').querySelector('.loading').classList.add('invisible')">
                </div>
                <div class="summaryDescription">
                    <h1 class="text-[1.4rem] font-bold line-clamp-1">${movie.name}</h1>
                    <div class="flex gap-[1.2rem] text-[#ffb219a1]"><span>${movie.known_for_department}</span></div>
                    <div class="w-[95%] mt-2 flex items-center gap-[.5rem] text-[#ffb219a1]"><span class="block line-clamp-3">${movie.known_for.map(m => m.title).join(', ')}</span></div>
                </div>
            </article>`;
        } else if (movie.media_type === "tv") {
            let currentPosterImage = movie.poster_path ? `${imageUrl}${movie.poster_path}` : 'images/logo.png';
            return `<article class="movieListItem w-full h-[150px] flex gap-[.5rem] text-[#f8B319] border border-[#ffb319] movie cursor-pointer" data-id="${movie.id}">
                <div class="w-[100px] shrink-0 relative">
                    <div class="bg-black w-full h-full top-0 left-0 border border-[#ffb319] absolute flex items-center justify-center z-30 animate-imageHolder loading">
                        <img class="w-[50px]" src="images/logo.png" alt="Honey movies logo">
                    </div>
                    <img class="${movie.poster_path ? 'h-full' : ''}" src="${currentPosterImage}" srcset="${movie.poster_path ? posterSrcset(movie.poster_path) : ''}" sizes="100px" alt="${movie.name}" onload="this.closest('article').querySelector('.loading').classList.add('invisible')">
                </div>
                <div class="summaryDescription">
                    <h1 class="text-[1.4rem] font-bold line-clamp-1">${movie.name}</h1>
                    <div class="flex gap-[1.2rem] text-[#ffb219a1]"><span>${movie.first_air_date}</span></div>
                    <div class="w-[95%] mt-2 flex items-center gap-[.5rem] text-[#ffb219a1]"><span class="block line-clamp-3">${movie.overview}</span></div>
                </div>
            </article>`;
        } else {
            if (type === "keywords") {
                return `<p class="text-[1.9rem] text-white font-[700] p-4 mx-auto">${movie.name}</p>`;
            } else if (type === "collections") {
                let currentPosterImage = movie.poster_path ? `${imageUrl}${movie.poster_path}` : 'images/logo.png';
                return `<article class="movieListItem w-full h-[150px] flex gap-[.5rem] text-[#f8B319] border border-[#ffb319] movie-collection cursor-pointer" data-id="${movie.id}">
                    <div class="w-[100px] shrink-0 relative flex items-center justify-center">
                        <div class="bg-black w-full h-full top-0 left-0 border border-[#ffb319] absolute flex items-center justify-center z-30 animate-imageHolder loading">
                            <img class="w-[50px]" src="images/logo.png" alt="Honey movies logo">
                        </div>
                        <img class="${movie.poster_path ? 'h-full' : ''}" src="${currentPosterImage}" srcset="${movie.poster_path ? posterSrcset(movie.poster_path) : ''}" sizes="100px" alt="${movie.name}" onload="this.closest('article').querySelector('.loading').classList.add('invisible')">
                    </div>
                    <div class="summaryDescription">
                        <h1 class="text-[1.4rem] font-bold line-clamp-1">${movie.name}</h1>
                        <div class="w-[95%] mt-2 flex items-center gap-[.5rem] text-[#ffb219a1]"><span class="block line-clamp-3">${movie.overview}</span></div>
                    </div>
                </article>`;
            }
        }
    }).join("");

    if (type === 'movie' || type === "tv-shows") {
        document.querySelectorAll('.movie').forEach(card => {
            card.addEventListener('click', (event) => {
                event.preventDefault();
                window.location.href = `movie-details.html?type=${type === 'movie' ? "movie" : "tv"}&id=${event.currentTarget.getAttribute('data-id')}`;
            });
        });
    } else if (type === 'people') {
        document.querySelectorAll('.person').forEach(card => {
            card.addEventListener('click', (event) => {
                event.preventDefault();
                window.location.href = `celebrity.html?id=${event.currentTarget.getAttribute('data-id')}`;
            });
        });
    } else if (type === 'collections') {
        document.querySelectorAll('.movie-collection').forEach(card => {
            card.addEventListener('click', (event) => {
                event.preventDefault();
                window.location.href = `movie-details.html?type=collection&id=${event.currentTarget.getAttribute('data-id')}`;
            });
        });
    }
}

function updateSearchBar() {
    searchBar.value = getQueryParameter('query') || '';
}

function updateResultText() {
    searchResultsText.textContent = `"${getQueryParameter('query') || '...'}"`;
}

function filterResults(allData, type) {
    return allData.filter(data => data.media_type === type);
}

function updateSearchResults(movies, tvs, people, collections, keywords) {
    document.querySelector('[data-type="movie"] > span').textContent = movies.length;
    document.querySelector('[data-type="tv"] > span').textContent = tvs.length;
    document.querySelector('[data-type="person"] > span').textContent = people.length;
    document.querySelector('[data-type="collection"] > span').textContent = collections.length;
    document.querySelector('[data-type="keywords"] > span').textContent = keywords.length;
}

function addImageListeners(imageElements) {
    imageElements.forEach(imageElement => {
        imageElement.addEventListener('load', () => {
            imageElement.closest('article')?.querySelector('.loading')?.classList.add('invisible');
        });
    });
}

function switchTab(newTab, listOfTabs) {
    listOfTabs.forEach(tab => {
        tab.setAttribute('aria-selected', false);
        tab.classList.remove('active');
    });
    newTab.setAttribute('aria-selected', true);
    newTab.focus();
    newTab.classList.add('active');
    moveIndicator(borderSlider, newTab);
}

function moveIndicator(slider, newTab) {
    slider.style.setProperty('left', newTab.offsetLeft + 'px');
    slider.style.setProperty('width', newTab.offsetWidth + 'px');
}

updateSearchBar();
updateResultText();

export { fetchSearchResults };
