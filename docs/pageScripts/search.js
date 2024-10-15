        import { imageUrl } from "./index.js";
        import { apiKey } from "./index.js";
        import { toggleLoader } from "./index.js";

        const searchBar = document.querySelector('.search-bar');

        const searchButton = document.querySelectorAll('.search-button');
        const closeButton = document.querySelector('.closeSearchModalBtn');
        const summaryResultsContainer = document.querySelector('.summaryResults');
        const searchResultsText = document.querySelector(".searchResultsText");
        let types = summaryResultsContainer.querySelectorAll('li');
        const searchInput = document.querySelectorAll('.search-bar');
        let movieResultsContainer = document.querySelector(".search-results-container");
        let imageElements = movieResultsContainer.querySelectorAll('img');
        let borderSlider = document.querySelector('.borderSlider');
        const resultsContainer = document.querySelector('.search-results-container');

        closeButton.addEventListener('click', (event)=>{
            searchBar.value = '';
        })
    
        searchButton.forEach(button=>{
            button.addEventListener('click', (event)=>{
                let button = event.currentTarget.closest('button');
                if(button){
                let input = button.parentElement.querySelector('.search-bar');
                const query = input.value.trim();
                if(query){
                    const baseURL = `${window.location.protocol}//${window.location.host}`;
    
                    if(window.location.host.includes('localhost') || window.location.hostname === "127.0.0.1"){
                        window.location.href = `${baseURL}/docs/search.html?query=${encodeURIComponent(query)}`;
                    }else {
                        window.location.href = `${baseURL}/search.html?query=${encodeURIComponent(query)}`;
                    }
    
                } 
                else {
                    console.log("No query is defined in the search bar.");
                }
                }
            });
        })
    
       
        //get the params from the address bar and search for the results accordingly.
        const query = getQueryParameter("query");
        if(query){
            fetchSearchResults(query);
        }else {
            resultsContainer.innerHTML = `<h1 class="text-[1.9rem] font-[700] p-4 mx-auto">You haven't searched for any movies!!</h1>`;
        }
    
        function getQueryParameter(queryName){
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get(queryName);
        }
        
        async function fetchSearchResults(query){
            const apiUrl = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${encodeURIComponent(query)}`;
        
            try {
                const [multiResults, collectionResults, keywordResults] = await Promise.all([
                    fetch(`https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${encodeURIComponent(query)}`)
                    .then(response => response.json()),
        
                    fetch(`https://api.themoviedb.org/3/search/collection?api_key=${apiKey}&query=${encodeURIComponent(query)}`)
                    .then(response => response.json()),
        
                    fetch(`https://api.themoviedb.org/3/search/keyword?api_key=${apiKey}&query=${encodeURIComponent(query)}`)
                    .then(response => response.json()),
                ]);
        
                let response = await fetch(apiUrl);
                if(!response.ok) throw new Error('Invalid response!!');
        
                const data = await response.json();

                const [movies, tvs, people, collections, keywords] = [filterResults(multiResults.results, 'movie'), filterResults(multiResults.results, 'tv'), filterResults(multiResults.results, 'person'), collectionResults.results, keywordResults.results];
                
                renderSearchResults(filterResults(multiResults.results, 'movie'), "movie");
                updateResultText();
                updateSearchBar();   
                updateSearchResults(movies, tvs, people, collections, keywords);
                addImageListeners(imageElements);

                setTimeout(()=>{
                    toggleLoader('hideLoader');
                }, 2000);

                types.forEach(mediaType=>{
                    mediaType.addEventListener('click', (event)=>{
                        let clickedTab = event.currentTarget;
                        /* console.log(button); */
                        
                        let type = event.currentTarget.getAttribute('data-type');
                        console.log(type, clickedTab);
                        
                        if(type === 'movie'){

                            switchTab(clickedTab, types);
                            moveIndicator(borderSlider, clickedTab)
                            renderSearchResults(filterResults(multiResults.results, 'movie'), 'movies');
                            switchTab(clickedTab, types);
                            moveIndicator(borderSlider, clickedTab)
                            setTimeout(()=>{
                                toggleLoader('hideLoader');
                            }, 2000);
                        }else if(type === "tv"){
                            renderSearchResults(filterResults(multiResults.results, 'tv'), 'tv-shows');
                            switchTab(clickedTab, types);
                            moveIndicator(borderSlider, clickedTab)

                            setTimeout(()=>{
                                toggleLoader('hideLoader');
                            }, 2000);
                        }else if(type === "person"){
                            renderSearchResults(filterResults(multiResults.results, 'person'), 'people');
                            switchTab(clickedTab, types);
                            moveIndicator(borderSlider, clickedTab)
                            setTimeout(()=>{
                                toggleLoader('hideLoader');
                            }, 2000);
                        }else if(type === "collection"){
                            renderSearchResults(collectionResults.results, "collections");
                            switchTab(clickedTab, types);
                            moveIndicator(borderSlider, clickedTab)
                           
                            setTimeout(()=>{
                                toggleLoader('hideLoader');
                            }, 2000);
                        }else if(type === "keywords"){
                            renderSearchResults(keywordResults.results, 'keywords');
                            switchTab(clickedTab, types);
                            moveIndicator(borderSlider, clickedTab)
                           
                            setTimeout(()=>{
                                toggleLoader('hideLoader');
                            }, 2000);
                        }
                        
                    })
                });
        
            } catch (error) {
                console.error('Error Fetching Results', error);
            }
        }
        
        function renderSearchResults(movies, type){
            const resultsContainer = document.querySelector('.search-results-container');
            console.log(movies, type);
            if(movies.length < 1) {
                resultsContainer.innerHTML = `<h1 class="text-[1.9rem] font-[700] p-4 mx-auto">There are no ${type} that matched your query.</h1>`;
        
                return;
            }
            resultsContainer.innerHTML = movies.map((movie)=>{
                
                if(movie.media_type === "movie"){
                    let currentPosterImage = `${imageUrl}${movie.poster_path}`;

                    if(movie.poster_path === null) {
                        currentPosterImage = 'images/logo.png';
                        
                    }
                    return `<article class="movieListItem  w-full h-[150px] flex gap-[.5rem] text-[#f8B319] border border-[#ffb319] movie cursor-pointer" data-id="${movie.id}">
                    <!-- image div -->
                    <div class="w-[100px] shrink-0 relative flex items-center justify-center">
                    <div class="bg-black w-full h-full top-0 left-0 lg:mx-auto border border-[#ffb319] absolute flex items-center justify-center z-30 animate-imageHolder loading">
                                <img class="w-[50px]" src="images/logo.png" alt="Honey movies logo">
                    </div>
                        <img class="${movie.poster_path === null ? '' : 'h-full'}" src="${currentPosterImage}" alt="${movie.title}">
                    </div>
        
                    <div class="summaryDescription">
                        <!-- heading -->
                        <h1 class="text-[1.4rem] font-bold line-clamp-1">${movie.title}</h1>
        
                        <div class="flex gap-[1.2rem] text-[#ffb219a1]">
                            <span>${movie.release_date}</span>
                        </div>
        
                        <div class="w-[95%] mt-2 flex items-center gap-[.5rem] text-[#ffb219a1]">
                            <span class="block line-clamp-3">
                               ${movie.overview}
                            </span>
                        </div>
                        <!-- year duration  -->
                        <!-- Rating -->
                    </div>
        
                    <!-- Summary description of the movie -->
                    </article>`;
        
                }
                else if(movie.media_type === "person"){
                    let currentProfileImage = `${imageUrl}${movie.profile_path}`;

                    if(movie.profile_path === null) {
                        console.log(movie.profile_path);
                        currentProfileImage = 'images/logo.png';
                        
                    }
                    return `<article class="movieListItem  w-full h-[150px] flex gap-[.5rem] text-[#f8B319] border border-[#ffb319] person cursor-pointer" data-id="${movie.id}">
                    <!-- image div -->
                    <div class="w-[100px] flex items-center justify-center shrink-0 relative">
                    <div class="bg-black w-full h-full top-0 left-0 lg:mx-auto border border-[#ffb319] absolute flex items-center justify-center z-30 animate-imageHolder loading">
                                <img class="w-[50px]" src="images/logo.png" alt="Honey movies logo">
                    </div>
                        <img class="${movie.profile_path === null ? '' : 'h-full'}" src="${currentProfileImage}" alt="${movie.name}" onerror="this.src='images/logo.png; this.onerror=null">
                    </div>
        
                    <div class="summaryDescription">
                        <!-- heading -->
                        <h1 class="text-[1.4rem] font-bold line-clamp-1">${movie.name}</h1>
        
                        <div class="flex gap-[1.2rem] text-[#ffb219a1]">
                            <span>${movie.known_for_department}</span>
                        </div>
        
                        <div class="w-[95%] mt-2 flex items-center gap-[.5rem] text-[#ffb219a1]">
                            <span class="block line-clamp-3">
                               ${movie.known_for.map(movie=>movie.title).join(', ')}
                            </span>
                        </div>
                        <!-- year duration  -->
                        <!-- Rating -->
                    </div>
        
                    <!-- Summary description of the movie -->
                </article>`
                }else if(movie.media_type === "tv"){
                    let currentPosterImage = `${imageUrl}${movie.poster_path}`;

                    if(movie.poster_path === null) {
                        currentPosterImage = 'images/logo.png';
                    }
                    return `<article class="movieListItem  w-full h-[150px] flex gap-[.5rem] text-[#f8B319] border border-[#ffb319] movie cursor-pointer" data-id="${movie.id}">
                    <!-- image div -->
                    <div class="w-[100px] shrink-0 relative">
                    <div class="bg-black w-full h-full top-0 left-0 lg:mx-auto border border-[#ffb319] absolute flex items-center justify-center z-30 animate-imageHolder loading">
                                <img class="w-[50px]" src="images/logo.png" alt="Honey movies logo">
                    </div>
                        <img class="${movie.profile_path === null ? '' : 'h-full'}" src="${currentPosterImage}" alt="${movie.name}">
                    </div>
        
                    <div class="summaryDescription">
                        <!-- heading -->
                        <h1 class="text-[1.4rem] font-bold line-clamp-1">${movie.name}</h1>
        
                        <div class="flex gap-[1.2rem] text-[#ffb219a1]">
                            <span>${movie.first_air_date}</span>
                        </div>
        
                        <div class="w-[95%] mt-2 flex items-center gap-[.5rem] text-[#ffb219a1]">
                            <span class="block line-clamp-3">
                               ${movie.overview}
                            </span>
                        </div>
                        <!-- year duration  -->
                        <!-- Rating -->
                    </div>
        
                    <!-- Summary description of the movie -->
                </article>`
                }else{
                    if(type === "keywords"){
                            return `<p class="text-[1.9rem] text-white font-[700] p-4 mx-auto">${movie.name}</p>`;
                    }
                    else if (type === "collections"){
                        let currentPosterImage = `${imageUrl}${movie.poster_path}`;

                        if(movie.poster_path === null) {
                            currentPosterImage = 'images/logo.png';
                            
                        }
                        return `<article class="movieListItem  w-full h-[150px] flex gap-[.5rem] text-[#f8B319] border border-[#ffb319] movie-collection cursor-pointer" data-id="${movie.id}">
                    <!-- image div -->
                    <div class="w-[100px] shrink-0 relative flex items-center justify-center">
                    <div class="bg-black w-full h-full top-0 left-0 lg:mx-auto border border-[#ffb319] absolute flex items-center justify-center z-30 animate-imageHolder loading">
                                <img class="w-[50px]" src="images/logo.png" alt="Honey movies logo">
                    </div>
                        <img class="${movie.poster_path === null ? '' : 'h-full'}" src="${currentPosterImage}" alt="${movie.name}">
                    </div>
        
                    <div class="summaryDescription">
                        <!-- heading -->
                        <h1 class="text-[1.4rem] font-bold line-clamp-1">${movie.name}</h1>
        
                        <div class="flex gap-[1.2rem] text-[#ffb219a1]">
                            <span></span>
                        </div>
        
                        <div class="w-[95%] mt-2 flex items-center gap-[.5rem] text-[#ffb219a1]">
                            <span class="block line-clamp-3">
                               ${movie.overview}
                            </span>
                        </div>
                        <!-- year duration -->
                        <!-- Rating -->
                    </div>
        
                    <!-- Summary description of the movie -->
                    </article>`;
                    }
                }
            }).join("");

            //add the event listeners to the current elements in view
            if(type === 'movie' || type === "tv-shows"){
                let results = document.querySelectorAll('.movie');
                results.forEach(movieResult=>{
                    movieResult.addEventListener('click', (event)=>{
                        event.preventDefault();
                        let card = event.currentTarget;

                        console.log(card);

                        window.location.href = `movie-details.html?type=${type === 'movie' ? "movie" : "tv"}&id=${card.getAttribute('data-id')}`; 
                        
                    })
                })
            }else if(type === 'people'){
                let results = document.querySelectorAll('.person');
                console.log(results);
                
                
                results.forEach(person=>{
                    person.addEventListener('click', (event)=>{
                        event.preventDefault();
                        let card = event.currentTarget;
                        console.log(type);

                        window.location.href = `celebrity.html?id=${card.getAttribute('data-id')}`; 
                    })
                })
            }else if(type === 'collections') {
                let results = document.querySelectorAll('.movie-collection');
                
                
                results.forEach(collection=>{
                    collection.addEventListener('click', (event)=>{
                        console.log(results);
                        event.preventDefault();
                        let card = event.currentTarget;
                        window.location.href = `movie-details.html?type=collection&id=${card.getAttribute('data-id')}`; 
                    })
                })
            }
        }
        
        function updateSearchBar(){
        searchBar.value = `${getQueryParameter('query') == true ? getQueryParameter('query') : ''}`
        }
        
        function updateResultText(){
        searchResultsText.textContent = `"${getQueryParameter('query') !== null ? getQueryParameter('query') : '...' }"`;
        }
        
        function filterResults(allData, type){
        const cleanedData = allData.filter(data=>{
            return data.media_type === type;
        });
        
        console.log(cleanedData);
        
        return cleanedData;
        }
        
        function updateSearchResults(movies, tvs, people, collections, keywords){
        document.querySelector('[data-type="movie"] > span').textContent = `${movies.length}`;
        document.querySelector('[data-type="tv"] > span').textContent = `${tvs.length}`;
        document.querySelector('[data-type="person"] > span').textContent = `${people.length}`;
        document.querySelector('[data-type="collection"] > span').textContent = `${collections.length}`;
        document.querySelector('[data-type="keywords"] > span').textContent = `${keywords.length}`;
        }

        function addImageListeners(imageElements) {
            imageElements.forEach(imageElement=>{
                imageElement.addEventListener('load', (event)=>{
                    console.log('an image has been loaded');
                })
            })
        }

        function switchTab(newTab, listOfTabs){
            /* Reset the attributes for all the buttons. */
            listOfTabs.forEach(tab=>{
                tab.setAttribute('aria-selected', false);
                tab.classList.remove('active');
            });
        
            newTab.setAttribute('aria-selected', true);
            newTab.focus();
            newTab.classList.add('active');
            moveIndicator(borderSlider, newTab);
        }
        
        function moveIndicator(slider, newTab){
            slider.style.setProperty('left', newTab.offsetLeft + 'px');
            slider.style.setProperty('width', newTab.offsetWidth + 'px');
        }
    
        updateSearchBar();
        updateResultText();   

        export { fetchSearchResults };