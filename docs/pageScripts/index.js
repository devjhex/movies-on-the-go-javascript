    const apiKey = '9669f3c4a020adb344371306e3fd4811' // my api key.
    const imageUrl = `https://image.tmdb.org/t/p/original`;
    const backdropUrl = `https://image.tmdb.org/t/p/original`; //base url and fileSize together
    const genresUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`;

    let apiUrl = `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&language=en-US&page=1`;
    const moviesUpcomingUrl = `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&language=en-US&page=1`;
    const top_ratedUrl = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=en-US&page=1`;
    const tvShowsUpcomingUrl = `https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}&language=en-US&page=1`;
    const animeUpcomingUrl = `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&language=en-US&with_genres=16&page=1`;

    let movies = [];

    const previewContainer = document.querySelector(".preview-container");
    let currentIndex = 0;
    let slides;
    let totalSlides;
    const transitionDuration = 1000;
    const displayDuration = 5000;
    let slideInterval;
    let fadeTimeout;

    let currentTab = localStorage.getItem('activeTab');
    let currentPage = localStorage.getItem('activePage');

    if(currentTab === "movies" && currentPage === "home"){
        apiUrl = moviesUpcomingUrl;
    }else if(currentTab === "movies" && currentPage === "top-rated"){
        apiUrl = top_ratedUrl;
    }else if(currentTab === "tv"){
        apiUrl = tvShowsUpcomingUrl;
    }else if(currentTab === "anime"){
        apiUrl = animeUpcomingUrl;
    }
    

let endpoints = [apiUrl, apiUrl];
const callbacks = [previewMovies, renderAllMovies];
const genericFunctions = [addButtonListeners, toggleLoader, startSlideShow, tabbingFunctionality];
const genericArguments = {addButtonListeners:undefined, toggleLoader:'hideLoader', startSlideShow:undefined, tabbingFunctionality:undefined};



async function fetchMovies (endpoint) {
    try {
        const response = await fetch (endpoint);

        if(!response) throw new Error ('Network response was not ok');

        const data = await response.json();

        previewMovies(data);
        renderAllMovies(data);
        addButtonListeners();
        

        toggleLoader("hideLoader")

        startSlideShow();

    } catch (error) {
        console.error('Fetch error occurred.', error);
    }
}

function previewMovies(movies) {
  const previewContainer = document.querySelector(".preview-container");
  let previewMovies = movies.results.slice(0, 3);

  previewContainer.innerHTML = previewMovies
    .map((movie, index) => {
            return `<article class="w-full h-full bg-cover bg-no-repeat absolute top-0 lg:mx-auto md:mt-[0rem] preview-slide banner cursor-pointer ${index === 0 ? "" : 'hidden' }" style="background-image:url(${backdropUrl}${movie.backdrop_path})" data-id="${movie.id}">
            <div class="bg-black bg-opacity-75 w-full h-full top-0 left-0 lg:mx-auto border border-[#ffb319] absolute flex items-center justify-center z-30">
              </div>
                          <div class="bg-black w-full h-full top-0 left-0 lg:mx-auto border border-[#ffb319] absolute flex items-center justify-center z-[9999] animate-imageHolder loading">
                                      <img class="w-[50px]" src="images/logo.png" alt="Honey movies logo">
                          </div>
                          <div class="relative h-full flex justify-between flex-col z-40">
                          <div class="flex items-center p-2 md:p-4">
                              <h2 class="w-full text-[3rem] font-[800] pt-[1.5rem] ml-[1.8rem] movie-title">${movie.title ? movie.title : movie.name}</h2>
                          </div>
      
                              <!-- !Summary of the whole movie here. -->
      
                              <div class="movieSummary p-4 w-11/12 ml-[1.8rem]">
                                  <div class="flex flex-col">
                                      <span class="movie-genre line-clamp-1 lg:line-clamp-2">Overview : ${movie.overview}</span>
                                      <span class="movie-release-date">Release Date: ${movie.release_date}</span>
                                      <div class="mt-2 bg-black  text-[#F8B319] w-max p-4  flex items-center gap-[.5rem]">
                                          <img src="images/star.svg" alt="ratings">
                                          <span class="text-[1.3rem] movie-rating">
                                              ${movie.vote_average.toFixed(1)} (${movie.vote_count})
                                          </span>
                                      </div>
                                  </div>
                              </div>
                              <div class="flex items-start sm:justify-between w-5/12 md:w-4/ ml-[1.8rem] pl-4">
                                  
                                  <button tabindex="-1" data-id="${movie.id}" class="h-[3.5rem]  flex bg-[#F8B319] text-black items-center justify-center px-4 font-[700] more-info-btn">
                                      More Info
                                  </button>
                                  
                              </div>
                          </div>
                      </article>`; 
    })
    .join("");

    slides = Array.from(previewContainer.querySelectorAll(".preview-slide"));
    totalSlides = slides.length;

     setInitialSlide();
}

function renderAllMovies(movies){
    const allMoviesContainer = document.querySelector('.allMoviesContainer');

    allMoviesContainer.innerHTML = movies.results.map((movie)=>{

        return `<article tabindex="-1" class="w-[12rem] h-[260px] border-r border-r-[#ffb319] relative flex flex-col gap-1 cursor-pointer banner" data-id="${movie.id}">
        
                        <div class="bg-black w-full h-full top-0 left-0 lg:mx-auto border border-[#ffb319] absolute flex items-center justify-center z-30 loading animate-imageHolder">
                            <img class="w-[50px]" src="images/logo.png" alt="Honey movies logo">
                        </div>
                        <div class="w-max overflow-hidden flex items-start">
                          <img class="object-contain w-full h-full" src="${imageUrl}${movie.poster_path}" alt="${movie.title ? movie.title : movie.name}">
                        </div>
                        <div class="absolute right-0">
                               
                            <div class="flex items-center justify-between">
                                <button tabindex="-1" class="p-[.5rem] flex items-center justify-center bg-[rgba(249,249,249,0.09)] flex-none border border-[#060402]">
                                    <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.5 2V10.5M10.5 19V10.5M10.5 10.5H19H2" stroke="#F9F9F9" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                                </button>
                            </div>
                        </div>
                        <div class="bg-[#ffb319] text-black">
                         <h1 class="text-[1.5rem] font-[700] pl-2 line-clamp-1">${movie.title ? movie.title : movie.name}</h1>
                        </div>
                    </article>`
    }).join("");
}

function addButtonListeners(){
    document.querySelectorAll('.more-info-btn').forEach((btn)=>{
        btn.addEventListener('click', function(event){
            event.stopPropagation();

            const movieId = this.getAttribute('data-id');
            let type = localStorage.getItem('activeTab') === "movies" ? "movie" : "tv";

            window.location.href = `movie-details.html?type=${type}&id=${movieId}`; 
        });
    });

    document.querySelectorAll('.banner').forEach(banner=>{
        banner.addEventListener('click', function(event){
            event.stopPropagation();

            const movieId = this.getAttribute('data-id');
            let type = localStorage.getItem('activeTab') === "movies" ? "movie" : "tv";

            window.location.href = `movie-details.html?type=${type}&id=${movieId}`; 
        });
    })
}

function startSlideShow() {
  clearInterval(slideInterval);

  slideInterval = setInterval(() => {
    fadeOutSlide(currentIndex);
  }, displayDuration + transitionDuration);
}

function setInitialSlide() {
    clearTimeout(fadeTimeout);
    fadeTimeout = setTimeout(() => {
    previewContainer.firstElementChild.classList.add("animate-fadeIn");
    }, transitionDuration);
}

function fadeOutSlide(index) {
  //first fade out the first slide to black.
  slides[index].classList.remove("animate-fadeIn");

  slides[index].classList.add("animate-fadeOut");

  //Update the current Index of the slides.
  currentIndex = (currentIndex + 1) % totalSlides;

  clearTimeout(fadeTimeout);
  fadeTimeout = setTimeout(() => {
    fadeInSlide(currentIndex);
    slides[index].classList.add('hidden');
  }, transitionDuration);
}

function fadeInSlide(index) {
  slides[index].classList.remove('hidden');

  slides[index].classList.remove("animate-fadeOut");

  slides[index].classList.add("animate-fadeIn");
}

function toggleLoader(action){
    
    let allLoaders = document.querySelectorAll('.loading');

    if(action === "hideLoader"){
        setTimeout(()=>{
            allLoaders.forEach((loader)=>{
                loader.classList.add('invisible');
            });
        }, 2000);
    }else if(action === "showLoader"){
        allLoaders.forEach((loader)=>{
            loader.classList.remove('invisible');
        });
    }

}

async function fetchAndExecute(endpoints, callbacks, customFunctions, customFunctionArguments){
    try {
        //Ensure the endpoints array and the callbacks array are the same length
        if(endpoints.length !== callbacks.length){
            throw new Error('The number of endpoints must match the number of callbacks.');
        }

        if(callbacks.length > 0){
            //Fetch all data simultaneously
        const responses = await Promise.all(endpoints.map(endpoint=>fetch(endpoint)));

        //convert each response to json
        const data = await Promise.all(responses.map(response=>response.json()));

        //create variable to hold all the results
        const results = [];

        //Execute each callback with its corresponding data
        data.forEach((result, index)=>{
            results.push(result);
            callbacks[index](result);
        })

        //Execute the custom functions that are not related to the data but need to called when the data arrives.
        if (customFunctions.length > 0) {
            customFunctions.forEach(func=>func(customFunctionArguments[func.name]));
        }
        }
        
        return results;
        
    } catch (error) {
        console.error('Error fetching data', error);
    }
   
}

function trapFocus(event, firstFocusableElement, lastFocusableElement){
    
    if(event.key === 'Tab' &&  !event.shiftKey){
        //if the user presses the tab key without the shift key and the last focusable element is focused focus the first element.

        if(document.activeElement === lastFocusableElement) {
            event.preventDefault();

            firstFocusableElement.focus();
        }
    } else if(event.key === 'Tab' && event.shiftKey){
        //if the user presses the tab key with the shift key and the first focusable element is focused focus the last focusable element.
        if(document.activeElement === firstFocusableElement) {
            event.preventDefault();

            lastFocusableElement.focus();
        }
    }else {
        return;
    }
}

function tabbingFunctionality(){
    let moviesParent = document.querySelector('.parentMovies');
    let previewParent = [document.querySelector('.preview-container')];
    let movieBannerParent = document.querySelector('.allMoviesContainer');
    let allMovieBanners = movieBannerParent.querySelectorAll('article');
    let allMoviesArray = Array.from(previewParent).concat(Array.from(allMovieBanners));

    moviesParent.addEventListener('keydown', (event)=>{
        console.log(previewParent, allMoviesArray);
        
        if(event.key === "Enter"){
            allMoviesArray.forEach(movie=>{
                movie.setAttribute('tabindex', 0);
            })

            allMoviesArray[0].focus();
        }
        trapFocus(event, allMoviesArray[0], allMoviesArray[allMoviesArray.length - 1]);
    });

    allMoviesArray.forEach(movieBanner=>{
        movieBanner.addEventListener('keydown', (event)=>{
            event.stopPropagation();
            if(event.key === 'ArrowRight'){
                let nextItem = movieBanner.nextElementSibling || allMoviesArray[0];
                if(movieBanner === allMoviesArray[0]){
                    nextItem = allMoviesArray[1];
                }
                nextItem.focus();
            }else if(event.key === 'ArrowLeft'){
                let previousItem = movieBanner.previousElementSibling || allMoviesArray[allMoviesArray.length - 1];
                previousItem.focus();
            }
        })
    });
}

function addDefaults(){
    if(!(localStorage.getItem('activeTab') && localStorage.getItem('activePage'))){
       
        
        localStorage.setItem('activeTab', 'movies');
        localStorage.setItem('activePage', 'home');
    }else {
        return;
    }
}

function fetchExec(endpoints, callbacks){
    if(endpoints.length !== callbacks.length){
     throw Error('The number of endpoints must match the number of callbacks.');
    }
    else{
        console.log('yaaay it is completely fine.!!!');
    }
}

document.addEventListener('DOMContentLoaded', (event)=>{
    addDefaults();
    fetchAndExecute(endpoints, callbacks, genericFunctions, genericArguments); 
    tabbingFunctionality();
});

export { apiKey, imageUrl, backdropUrl, genresUrl, fetchMovies, fetchAndExecute, toggleLoader, renderAllMovies, setInitialSlide, startSlideShow, fadeInSlide, fadeOutSlide, addButtonListeners, trapFocus, fetchExec };