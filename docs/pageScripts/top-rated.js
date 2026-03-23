import { loadSharedComponents } from './common.js';
import { top_ratedUrl, fetchAndExecute } from './api.js';
import { renderPage, addButtonListeners, startSlideShow } from './index.js';

const genericFunctions = [addButtonListeners, startSlideShow];
const genericArguments = { addButtonListeners: undefined, startSlideShow: undefined };

document.addEventListener('DOMContentLoaded', () => {
    localStorage.setItem('activeTab', 'movies');
    localStorage.setItem('activePage', 'top-rated');
    loadSharedComponents();
    fetchAndExecute([top_ratedUrl], [renderPage], genericFunctions, genericArguments);
});
