import { backdropUrl } from "./index.js";
import { imageUrl } from "./index.js";
import { apiKey } from "./index.js";
import { genresUrl } from "./index.js";
import { toggleLoader } from "./index.js";
document.addEventListener('DOMContentLoaded', (event)=>{
    const apiUrl = `https://api.themoviedb.org/3/person/popular?api_key=${apiKey}&language=en-US&page=1`;
    const imageUrl = `https://image.tmdb.org/t/p/w200`;

    const celebritiesContainer = document.querySelector('.celebrities-container');


    async function fetchCelebrities(){
        try {
            let response =  await fetch(apiUrl);

        if(!response) throw new Error ('Network response was not ok');

        let data = await response.json();

        renderCelebrities(data.results);

        
        setTimeout(()=>{
            toggleLoader('hideLoader');
        }, 2000);

        } catch (error) {
            console.error('Fetch error occurred.', error);
        }
    }

    function renderCelebrities(celebrities) {

    celebritiesContainer.innerHTML = celebrities
        .map((celebrity) => {
            let movieTitles = celebrity.known_for.map((movie)=>{
                return movie["title"];
            }).filter(title => title !== undefined).join(", ");
            let currentPosterImage = `${imageUrl}${celebrity.profile_path}`;

                    if(celebrity.profile_path === null) {
                        currentPosterImage = 'images/logo.png';
                        
                    }
          return ` <article class="w-5/12 max-w-[250px] border border-[#ffb319] p-1 relative celebrity cursor-pointer" data-id="${celebrity.id}">
                    <div class="bg-black w-full h-full top-0 left-0 lg:mx-auto border border-[#ffb319] absolute flex items-center justify-center z-30 animate-imageHolder loading">
                                <img class="w-[50px]" src="images/logo.png" alt="Honey movies logo">
                    </div>
                        <div class="profie-image-container">
                            <img class="w-full h-full" src="${currentPosterImage}" alt="${celebrity.name}">
                        </div>
            
                        <div>
                            <h1 class="text-[#ffaa00] text-[1rem] md:text-[1.4rem] text-center line-clamp-1 celebrity-name cursor-pointer" data-id="${celebrity.id}">${celebrity.name}</h1>
                            <div class="movies-played">
                                <p class=" text-slate-400 line-clamp-1">${movieTitles}</p>
                            </div>
                        </div>
                    </article>`;
        })
        .join("");

    const celebrityNames = document.querySelectorAll(".celebrity");

    celebrityNames.forEach(name=>{
        name.addEventListener("click", (event)=>{
            let id = event.currentTarget.getAttribute('data-id');
            console.log(id);
            window.location.href = `celebrity.html?id=${id}`;
        })
    });
    }

    fetchCelebrities()
    
})