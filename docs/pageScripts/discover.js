import { loadSharedComponents } from './common.js';
import { moviesUpcomingUrl, fetchAndExecute } from './api.js';
import { renderPage, addButtonListeners, startSlideShow } from './index.js';

const genericFunctions = [addButtonListeners, startSlideShow];
const genericArguments = { addButtonListeners: undefined, startSlideShow: undefined };

document.addEventListener('DOMContentLoaded', () => {
    localStorage.setItem('activeTab', 'movies');
    localStorage.setItem('activePage', 'discover');
    loadSharedComponents();
    fetchAndExecute([moviesUpcomingUrl], [renderPage], genericFunctions, genericArguments);
});
