import { initializeSideBar } from "../scripts/sidebar.js";
import { initializeTabSlider } from "../scripts/tabSlider.js";
import { initializeSelectMenu } from "../scripts/customSelectMenu.js";
import { initializeSearchBar } from "../scripts/searchBar.js";
import { initializeFooter } from "../scripts/footer.js";

export function loadSharedComponents() {
    if (document.querySelector('.headerContent')) initializeSearchBar();
    if (document.querySelector('.navBarContent')) initializeSideBar();
    if (document.querySelector('.sliderAndGenreContent')) {
        initializeSearchBar();
        initializeSelectMenu();
        initializeTabSlider();
    }
    if (document.querySelector('.footerContent')) initializeFooter();
}
