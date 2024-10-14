import { imageUrl } from "./index.js";
import { apiKey } from "./index.js";
import { toggleLoader } from "./index.js";
import { fetchAndExecute } from "./index.js";

document.addEventListener('DOMContentLoaded', ()=>{
    const urlParams = new URLSearchParams(window.location.search);
    let movieType = urlParams.get('type');
    const movieId = urlParams.get('id');
    const trailerParent = document.querySelector(".trailer-container");

    const apiUrl = `https://api.themoviedb.org/3/${movieType}/${movieId}?api_key=${apiKey}&language=en-US`;
    
    const castUrl = `https://api.themoviedb.org/3/${movieType}/${movieId}/credits?api_key=${apiKey}&language=en-US`;

    const trailersUrl = `https://api.themoviedb.org/3/${movieType}/${movieId}/videos?api_key=${apiKey}`;

    let endpoints = [apiUrl, castUrl, trailersUrl];

    const callbacks = [renderMovieDetails, renderCast, filterTrailers];

    const genericFunctions = [toggleLoader, displayMovieTrailer];
    const genericArguments = {toggleLoader:'hideLoader'};


    function displayMovieTrailer(trailer){

            if(trailer){

                const trailerElement = document.createElement('iframe');

                trailerElement.src = `https://www.youtube.com/embed/${trailer.key}`;
                trailerElement.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
                trailerElement.allowFullscreen = true;
                trailerElement.classList.add("w-full", "h-[315px]", "md:w-[600px]");
                
                trailerParent.innerHTML = "";
                trailerParent.appendChild(trailerElement);
            }else{
                
                trailerParent.innerHTML = `<h1 class="text-[1.9rem] text-white font-[700] p-4 mx-auto">There are no trailers available!!</h1>`;
            }

    }

    function filterTrailers(data){

            //filter the trailers out because you can filter out clips, trailers, teasers etc.
            const trailers = data.results.filter(video=>{
                return (video.type === "Trailer" && video.site === "YouTube");
            });

            if(trailers.length > 0) {
                //add the trailer to the Arguments array for the custom functions to use it.
                genericArguments.displayMovieTrailer = trailers[0];

                return trailers[0];
                
                
            }
    }

    function renderMovieDetails(movieDetails) {
        //render the data to the specific parts of the page.
        document.querySelector('.movie-title').textContent = movieDetails.title ? movieDetails.title : movieDetails.name;

        //render the background-image
        document.body.style.backgroundImage = `url(${imageUrl}${movieDetails.backdrop_path})`;

        //render the poster-image
        document.querySelector('.movie-poster').src = `${imageUrl}${movieDetails.poster_path}`;
        
        //render the voteAverage
        document.querySelector('.voteAverage').textContent = `${movieDetails.vote_average.toFixed(1)} (${movieDetails.vote_count})`;

        //render the movie overview
        document.querySelector('.movie-overview').textContent = movieDetails.overview ? movieDetails.overview : "Movie Overview not available !!!";
    
    }
    
    function renderCast(people){
        people = people.cast;
        
        const castContainer = document.querySelector('.cast-container');

      if(people.length > 0){
        castContainer.innerHTML = people.map((person)=>{
            let currentPosterImage = `${imageUrl}${person.profile_path}`;

                    if(person.profile_path === null) {
                        currentPosterImage = 'images/logo.png';
                        
                    }
            return `<div class="movieCard p-1 w-[150px] h-full shrink-0 border border-[#ffb319] bg-black relative celebrity cursor-pointer" data-id="${person.id}">
                            <div class="bg-black w-full h-full top-0 left-0 lg:mx-auto border border-[#ffb319] absolute flex items-center justify-center z-30 animate-imageHolder loading">
                                <img class="w-[50px]" src="images/logo.png" alt="Honey movies logo">
                            </div>
                            <div class="bg-black flex items-center justify-center">
                                <img class="" src="${currentPosterImage}" alt="${person.name}">
                            </div>
                            <div class="bg-[#ffb319]">
                                <h1 class="text-black font-[700] text-[1rem] text-center celebrity-name cursor-pointer line-clamp-1" data-id="${person.id}">${person.name}</h1>
                            </div>
                    </div>`
        }).join("");
      }else{
        castContainer.innerHTML = `<h1 class="text-[1.9rem] font-[700] p-4 mx-auto">No cast available !</h1>`;
    }

    const celebrity = document.querySelectorAll('.celebrity');

    celebrity.forEach(celeb=>{
        
         celeb.addEventListener("click", (event)=>{
            
            let id = event.currentTarget.getAttribute('data-id');

            window.location.href = `celebrity.html?id=${id}`;
        })
    })
    }

    fetchAndExecute(endpoints, callbacks, genericFunctions, genericArguments);
});



