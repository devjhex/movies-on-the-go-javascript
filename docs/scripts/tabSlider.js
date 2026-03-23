import { fetchAndExecute } from '../pageScripts/api.js';
import { renderPage } from '../pageScripts/index.js';
import { moviesUpcomingUrl, tvShowsUpcomingUrl, animeUpcomingUrl } from '../pageScripts/api.js';

export function initializeTabSlider() {
    const tabsContainer = document.querySelector('.tabsContainer');
    const tabList = tabsContainer.querySelector('.tabList');
    const tabButtons = tabList.querySelectorAll('button');
    const slider = tabsContainer.querySelector('.bottomSlider');
    const liveRegion = tabsContainer.querySelector('#liveRegion');

    let currentTab = document.querySelector(`[data-type="${localStorage.getItem('activeTab')}"]`);
    switchTab(currentTab);
    document.activeElement.blur();
    reselectItem(tabButtons, currentTab, 'activeTab');

    tabsContainer.addEventListener('click', (event) => {
        const clickedTab = event.target.closest('button');
        if (!clickedTab) return;

        const type = clickedTab.getAttribute('data-type');
        switchTab(clickedTab);
        reselectItem(tabButtons, clickedTab, 'activeTab');
        localStorage.setItem('activeTab', type);

        if (type === "movies") fetchAndExecute([moviesUpcomingUrl], [renderPage]);
        else if (type === "tv") fetchAndExecute([tvShowsUpcomingUrl], [renderPage]);
        else if (type === "anime") fetchAndExecute([animeUpcomingUrl], [renderPage]);

        liveRegion.textContent = clickedTab.textContent;
    });

    tabsContainer.addEventListener('keydown', (event) => {
        if (event.key === "Enter") {
            const tabSelected = tabsContainer.querySelector('[aria-selected="true"]');
            tabButtons.forEach(tab => tab.setAttribute('tabindex', 0));
            tabSelected !== tabButtons[0] ? tabSelected.focus() : tabButtons[0].focus();

            const firstFocusableElement = tabButtons[0];
            const lastFocusableElement = tabButtons[2];

            tabList.addEventListener("keydown", (event) => {
                event.stopPropagation();
                if (event.key === 'Tab' && !event.shiftKey && document.activeElement === lastFocusableElement) {
                    event.preventDefault();
                    firstFocusableElement.focus();
                } else if (event.key === 'Tab' && event.shiftKey && document.activeElement === firstFocusableElement) {
                    event.preventDefault();
                    lastFocusableElement.focus();
                }
            });
        }
    });

    tabButtons.forEach((tab, index) => {
        tab.setAttribute('role', 'tab');
        if (index === 0) {
            tab.setAttribute('aria-selected', true);
            tab.classList.add('active');
        }

        tab.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowRight') {
                event.preventDefault();
                const nextItem = Array.from(tabButtons).indexOf(tab) === 2 ? tabButtons[0] : tab.nextElementSibling;
                nextItem.focus();
            } else if (event.key === "ArrowLeft") {
                event.preventDefault();
                const previousItem = tab.previousElementSibling || tabButtons[tabButtons.length - 1];
                previousItem.focus();
            } else if (event.key === "Enter") {
                event.stopPropagation();
                switchTab(event.target);
                event.target.setAttribute('aria-selected', true);
                reselectItem(tabButtons, event.target, 'activeTab');
                liveRegion.textContent = event.target.textContent;
            } else if (event.key === "Escape") {
                event.preventDefault();
                tabButtons.forEach(tab => tab.setAttribute('tabindex', -1));
                tabsContainer.focus();
            }
        });
    });

    document.addEventListener('click', (event) => {
        if (!tabList.contains(event.target) && (Array.from(tabList).indexOf(document.activeElement) >= 0)) {
            tabButtons.forEach(tab => tab.setAttribute('tabindex', -1));
        }
    });

    function switchTab(newTab) {
        tabButtons.forEach(tab => {
            tab.setAttribute('aria-selected', false);
            tab.classList.remove('active');
        });
        newTab.setAttribute('aria-selected', true);
        newTab.focus();
        newTab.classList.add('active');
        moveIndicator(newTab);
    }

    function moveIndicator(newTab) {
        slider.style.setProperty('left', newTab.offsetLeft + 'px');
        slider.style.setProperty('width', newTab.offsetWidth + 'px');
    }

    function reselectItem(listOfItems, itemSelected, selectClass) {
        listOfItems.forEach(item => item.classList.remove(selectClass));
        itemSelected.classList.add(selectClass);
    }
}
