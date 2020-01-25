// Api used --> https://forkify-api.herokuapp.com/

import Search from './models/Search';
import { elements, renderLoader, removeLoader } from './views/base';
import * as searchView from './views/searchView';

/**Global app state
 * > Search object
 * > Current recipe object
 * > Shopping list
 * > Linked recipes
 */
const state = {};

const controlSeach = async () => {
    // get query text from view
    const query = searchView.getInput();

    if (query) {
        // save as new Search object to the state
        state.search = new Search(query);

        // Prepare the ui for showing results
        searchView.clearResults();
        renderLoader(elements.searchRes);

        // Search for recipes
        await state.search.getResults();

        // Render the search results in ui
        removeLoader();
        searchView.clearInput();
        searchView.renderRecipes(state.search.recipes);
    }
};

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault(); // stops the page from reloading when search button clicked

    controlSeach();
});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');

    if (btn) {
        const gotoPage = parseInt(btn.dataset.goto);
        searchView.clearResults();
        searchView.renderRecipes(state.search.recipes, gotoPage);
    }
});