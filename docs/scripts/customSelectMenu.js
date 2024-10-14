import { fetchMovies, fetchAndExecute, apiKey } from "../pageScripts/index.js";

export function initializeSelectMenu(){
    const customMenuContainer = document.querySelector('.customMenuContainer');
    const customMenuButton = customMenuContainer.querySelector("#customMenuButton");
    const buttonText = customMenuButton.querySelector('span');
    const customMenu = customMenuContainer.querySelector('#customMenu');
    const menuItems = customMenu.querySelectorAll('[role="menuItem"]');
    const liveRegion = customMenu.querySelector('#liveRegion');
    let clickedGenre = undefined;

    let type = localStorage.getItem('activeTab') === 'movie' ? "movie" : "tv";

    const genresUrl = `https://api.themoviedb.org/3/genre/${type}/list?api_key=${apiKey}&language=en-US`;

    let endpoints = [genresUrl];

    const callbacks = [renderAllGenres];

    const genericFunctions = [];
    const genericArguments = {};

    customMenuContainer.addEventListener('click', (event)=>{
        const button = event.target.closest('button');

        if(button) {
            const isExpanded = button.getAttribute('aria-expanded') === 'true';

        button.setAttribute('aria-expanded', !isExpanded);

        
        /* Display the menu */
            /* Change some attributes. */
        customMenu.setAttribute('aria-hidden', isExpanded); //now true;
        customMenu.classList.toggle('hidden');

        /* take the focus to the first element. */
        if(!isExpanded){
            if(clickedGenre) {
                lastSelectedGenre(clickedGenre).focus();
            }else {
                lastSelectedGenre().focus();
            }
        }

        /* For the user moving up and down the items in the menu */
        // menuItems.forEach(item=>{
        //     item.addEventListener('keydown', (event)=>{
        //         console.log(event.currentTarget.key);
        //         if(event.currentTarget.key === "ArrowDown"){
        //             event.preventDefault();
        //             const nextItem = item.nextElementSibling || menuItems[0];
        //             nextItem.focus();
        //         }else if(event.key === "ArrowUp") {
                    
        //             const previousItem = item.previousElementSibling || menuItems[menuItems.length - 1];
        //             previousItem.focus();
        //         }else if(event.key === 'Escape'){
        //             button.focus();
        //             button.setAttribute('aria-expanded', 'false');
        //             customMenu.setAttribute('aria-hidden', 'true');     
        //             customMenu.classList.add('hidden');           
        //         }else if(event.key === 'Enter') {

        //             /* Save the current element that has been clicked. */
        //             clickedGenre = event.target;
        //             console.log(clickedGenre);

        //             button.focus();
        //             button.setAttribute('aria-expanded', 'false');
        //             customMenu.setAttribute('aria-hidden', 'true');     
        //             customMenu.classList.add('hidden');

        //             reselectItem(menuItems, event.target, 'active');

        //             resetToggleIndicator(menuItems, event.target, 'hidden');

        //             customMenuButton.querySelector('span').textContent = event.target.querySelector('span').textContent;
                    
        //             console.log(customMenuButton.querySelector('span').textContent, event.target.querySelector('span').textContent);

        //             liveRegion.textContent = event.target.querySelector('span').textContent;

        //         }
        //     })
        // });
        
        /* For when the user uses the tab to move through the items in the menu. */
        const firstFocusableElement = menuItems[0];
        const lastFocusableElement = menuItems[menuItems.length - 1];

        function trapFocus(event){
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
            }
        }

        customMenu.addEventListener('keydown', trapFocus);
        }
    });

    customMenuContainer.addEventListener('keydown', (event)=>{
        console.log(event.key);
        if (event.key === 'Enter') {
            
            event.preventDefault();
            /* focus the button element */
            customMenuButton.focus();
        }
    });

    customMenuButton.addEventListener('keydown', (event)=>{

        if(event.key === 'Enter'){
            // clickedGenre.focus();
            event.stopPropagation();

            if(clickedGenre) {
                lastSelectedGenre(clickedGenre).focus();
            }else {
                lastSelectedGenre().focus();
            }

        }else if(event.key === 'Escape'){
            customMenuContainer.focus();
        }
    });

    document.addEventListener('click',(event)=>{
        let menuOpen = customMenu.classList.contains('hidden');

        if(!customMenuContainer.contains(event.target) && !menuOpen){
            customMenu.classList.add('hidden');
            
        }else{
            return;
        }
    });

    function lastSelectedGenre(genre=menuItems[0]) {
        return genre;
    }

    function reselectItem(listOfItems, itemSelected, selectClass){
        listOfItems.forEach(item=>{
            item.classList.remove(selectClass);
        });
        itemSelected.classList.add(selectClass);
    }

    function resetToggleIndicator(listOfItems, itemSelected, selectClass){
        listOfItems.forEach(item=>{
            item.querySelector('img').classList.add(selectClass);
        });
        itemSelected.querySelector('img').classList.remove(selectClass);
    }

    function renderAllGenres(data){
        let genres = data.genres;
        customMenu.innerHTML = genres.map((genre)=>{
            return `<li role="menuItem" tabindex="0" class="flex items-center justify-between w-full transition-colors text-white border  border-black p-2 hover:border-b-[#ffb319] hover:text-[#ffb319] focus:text-[#ffb319] cursor-pointer" data-id="${genre.id}">
                                    <span class=" text-[1.2rem]">${genre.name}</span>
                                    <img src="images/completed.svg" alt="completed" class="mr-4 w-[1.5rem] h-[1.5rem] hidden">
                                </li>`
        }).join("");

        document.querySelectorAll('[role="menuItem"]').forEach(item=>{
        
            item.addEventListener('click', (event)=>{
                event.stopPropagation();
                let type = localStorage.getItem('activeTab') === 'movie' ? "movie" : "tv";
                const genre = event.currentTarget;

                let customUrl = `https://api.themoviedb.org/3/discover/${type}?api_key=${apiKey}&language=en-US&with_genres=${item.getAttribute('data-id')}&page=1`;

                if(!genre) return;
        
                clickedGenre = genre;
        
                reselectItem(document.querySelectorAll('[role="menuItem"]'), genre, 'active');

                resetToggleIndicator(document.querySelectorAll('[role="menuItem"]'), genre, 'hidden');

                fetchMovies(customUrl);

                customMenu.classList.add('hidden');

                customMenuButton.querySelector('span').textContent = genre.querySelector('span').textContent;

                liveRegion.textContent = genre.querySelector('span').textContent;
        
            })
        });
    }

    fetchAndExecute(endpoints, callbacks, genericFunctions, genericArguments);

}

