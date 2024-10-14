import { initializeSideBar } from "../scripts/sidebar.js";
import { initializeTabSlider } from "../scripts/tabSlider.js";
import { initializeSelectMenu } from "../scripts/customSelectMenu.js";
import { initializeSearchBar } from "../scripts/searchBar.js";
import { initializeFooter } from "../scripts/footer.js";

function loadSharedComponents() {
    fetch('shared.html')
    .then((response)=>{
        return response.text();
    })
    .then((data)=>{
        
        const parser = new DOMParser();
        const _Document = parser.parseFromString(data, 'text/html'); 

    //if on the page load the header content
    if(document.querySelector('.headerContent')){
        
        let currentUrl = window.location.href;
        let currentFileName = currentUrl.substring(currentUrl.lastIndexOf("/") + 1).replace('?', '');
        document.querySelector('.headerContent').innerHTML = _Document.getElementById('headerContent').innerHTML;

        initializeSearchBar();
    }

    //load the navigation bar
    if(document.querySelector('.navBarContent')){
        
        document.querySelector('.navBarContent').innerHTML = _Document.getElementById('navBarContent').innerHTML;
        initializeSideBar();
    }

    //load the slider and Genre select Menu content
    if(document.querySelector('.sliderAndGenreContent')){
        document.querySelector('.sliderAndGenreContent').innerHTML = _Document.getElementById('sliderAndGenreContent').innerHTML;

        initializeSearchBar();
        initializeSelectMenu();
        initializeTabSlider();
        
    }
        
    //load the footer
    if( document.querySelector('.footerContent')){
        document.querySelector('.footerContent').innerHTML = _Document.getElementById('footerContent').innerHTML;
        initializeFooter();
    }

    });
    
}

document.addEventListener('DOMContentLoaded', (event)=>{

    loadSharedComponents();
    
})