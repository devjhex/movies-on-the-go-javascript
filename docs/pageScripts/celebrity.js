import { apiKey } from "./index.js";
import { toggleLoader } from "./index.js";
import { fetchAndExecute } from "./index.js";

document.addEventListener('DOMContentLoaded', (event)=>{
    const urlParams = new URLSearchParams(window.location.search);
    const celebrityId = urlParams.get('id');

    const apiUrl = `https://api.themoviedb.org/3/person/${celebrityId}?api_key=${apiKey}`;
    const creditsUrl = `https://api.themoviedb.org/3/person/${celebrityId}/combined_credits?api_key=${apiKey}`;

    let endpoints = [apiUrl, creditsUrl, creditsUrl];

    const callbacks = [renderCelebrity, renderCelebrityCredits, renderMoviesPlayed];

    const genericFunctions = [toggleLoader];
    const genericArguments = {toggleLoader:'hideLoader'};

    const imageUrl = `https://image.tmdb.org/t/p/w300`;

    function renderCelebrity(celebrity){
        //render celebrity poster
        document.querySelector('.celebrity-image').src = `${imageUrl}${celebrity.profile_path}`;

        //render celebrity name
        document.querySelector('.celebrity-name').textContent = celebrity.name;

        //render celebrity department
        document.querySelector('.known-for').textContent = celebrity.known_for_department;

        //render celebrity gender
        document.querySelector('.gender').textContent = celebrity.gender === 1 ? "Female" : "Male";

        //render celebrity birthday
        document.querySelector('.birthday').textContent = celebrity.birthday;

        //render celebrity place of birth
        document.querySelector('.place-of-birth').textContent = celebrity.place_of_birth;


        //render celebrity biography
        document.querySelector('.celebrity-biography').textContent = celebrity.biography;


        
    }

    function renderCelebrityCredits(credits){
        //render known credits
        document.querySelector('.known-credits').textContent = credits.cast.length;
    }

    function renderMoviesPlayed(movies){
        const movieCardContainer = document.querySelector('.movie-card-container');

        movies = movies.cast.slice(0,20);

        movieCardContainer.innerHTML = movies.map((movie)=>{
            let currentPosterImage = `${imageUrl}${movie.poster_path}`;

                    if(movie.poster_path === null) {
                        currentPosterImage = 'images/logo.png';
                        
                    }
            return `<div class="movieCard p-1 w-[150px] shrink-0 border border-[#ffb319] relative cursor-pointer" data-id="${movie.id}">
                             <div class="bg-black w-full h-full top-0 left-0 lg:mx-auto border border-[#ffb319] absolute flex items-center justify-center z-30 animate-imageHolder loading">
                                <img class="w-[50px]" src="images/logo.png" alt="Honey movies logo">
                            </div>
                            <div>
                                <img src="${currentPosterImage}" alt="${movie.title}">
                            </div>
                            <div class="bg-[#ffb319]">
                                 <h1 class="text-black font-[700] text-[1rem] text-center celebrity-name cursor-pointer line-clamp-1" data-id="${movie.id}">${movie.title}</h1>
                            </div>
                        </div>`
        }).join("");

        let movieCards = document.querySelectorAll('.movieCard');

        movieCards.forEach(card=>{
        
            card.addEventListener("click", (event)=>{
               
               let id = event.currentTarget.getAttribute('data-id');
                
               window.location.href = `movie-details.html?type=movie&id=${id}`;
           })
       })
        

    }
    
    fetchAndExecute(endpoints, callbacks, genericFunctions, genericArguments);
})