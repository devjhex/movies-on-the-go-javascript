import { fetchMovies } from '../pageScripts/index.js';

export function initializeTabSlider () {

    const apiKey = '9669f3c4a020adb344371306e3fd4811' // my api key.
    const moviesUpcomingUrl = `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&language=en-US&page=1`;
    const tvShowsUpcomingUrl = `https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}&language=en-US&page=1`;
    const animeUpcomingUrl = `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&language=en-US&with_genres=16&page=1`;

    const imageUrl = `https://image.tmdb.org/t/p/w200`;
    const backdropUrl = `https://image.tmdb.org/t/p/w780`;

    const tabsContainer = document.querySelector('.tabsContainer');
    const tabList = tabsContainer.querySelector('.tabList');
    const tabButtons = tabList.querySelectorAll('button');
    const slider = tabsContainer.querySelector('.bottomSlider');
    const liveRegion = tabsContainer.querySelector('#liveRegion');

    let currentTab = document.querySelector(`[data-type="${localStorage.getItem('activeTab')}"]`);

    switchTab(currentTab);
    document.activeElement.blur();
    reselectItem(tabButtons, currentTab, 'activeTab');



tabsContainer.addEventListener('click', (event)=>{
    const clickedTab = event.target.closest('button');
    let type = clickedTab.getAttribute('data-type');
    
    
    if(!clickedTab) return;
    switchTab(clickedTab);
    reselectItem(tabButtons, clickedTab, 'activeTab');
    console.log(clickedTab);

    localStorage.setItem('activeTab', type);
    
    if (type === "movies") {
        fetchMovies(moviesUpcomingUrl);
    }else if (type === "tv"){
        fetchMovies(tvShowsUpcomingUrl)
    }else if(type === "anime"){
        fetchMovies(animeUpcomingUrl);
    }
    liveRegion.textContent = event.target.textContent;
});

tabsContainer.addEventListener('keydown', (event)=>{
    if(event.key === "Enter") {
        let tabSelected = tabsContainer.querySelector('[aria-selected="true"]');

        tabButtons.forEach(tab=>{
            tab.setAttribute('tabindex', 0);
        });

        if(tabSelected !== tabButtons[0]){
            tabSelected.focus();
        }else {
            tabButtons[0].focus();
        }

        /* First check if there is any tab which is active at the moment of clicking the Enter key, if there is no key that is active then you can focus on the first element. (undone)*/
          

        const firstFocusableElement = tabButtons[0];
        const lastFocusableElement  = tabButtons[2];

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
        tabList.addEventListener("keydown",(event)=>{
            event.stopPropagation();
            trapFocus(event);
        })
    }
});

tabButtons.forEach((tab, index)=>{
    tab.setAttribute('role', 'tab');
    
    if(index===0){
        tab.setAttribute('aria-selected', true);
        tab.classList.add('active');
    }

    tab.addEventListener('keydown', (event)=>{
    if(event.key === 'ArrowRight'){
        event.preventDefault();
        const nextItem = Array.from(tabButtons).indexOf(tab) === 2 ? tabButtons[0] : tab.nextElementSibling;
        nextItem.focus();
    }else if(event.key === "ArrowLeft"){
        event.preventDefault();
        const previousItem = tab.previousElementSibling || tabButtons[tabButtons.length - 1];
        previousItem.focus();
    }else if(event.key === "Enter"){
        event.stopPropagation();
        switchTab(event.target);
        event.target.setAttribute('aria-selected', true);
        reselectItem(tabButtons, event.target, 'activeTab');
        liveRegion.textContent = event.target.textContent;
        // tabsContainer.focus();
    }
    else if(event.key === "Escape"){
        event.preventDefault();
        tabButtons.forEach(tab=>{
            tab.setAttribute('tabindex', -1);
        });
        tabsContainer.focus();
    }
    })
});

document.addEventListener('click',(event)=>{
    if(!tabList.contains(event.target) && (Array.from(tabList).indexOf(document.activeElement) >= 0)){
        
        tabButtons.forEach(tab=>{
            tab.setAttribute('tabindex', -1);
        });
        
    }else{
        return;
    }
});

function switchTab(newTab){

    /* Reset the attributes for all the buttons. */
    tabButtons.forEach(tab=>{
        tab.setAttribute('aria-selected', false);
        tab.classList.remove('active');
    });

    newTab.setAttribute('aria-selected', true);
    newTab.focus();
    newTab.classList.add('active')
    moveIndicator(newTab);
}

function moveIndicator(newTab){
    slider.style.setProperty('left', newTab.offsetLeft + 'px');
    slider.style.setProperty('width', newTab.offsetWidth + 'px');
}

function reselectItem(listOfItems, itemSelected, selectClass){
    listOfItems.forEach(item=>{
        item.classList.remove(selectClass);
    });
    itemSelected.classList.add(selectClass);
}
}

