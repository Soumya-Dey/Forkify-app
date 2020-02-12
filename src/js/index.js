// Api used --> https://forkify-api.herokuapp.com/

import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import { elements, renderLoader, removeLoader } from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';

/**Global app state
 * > Search object
 * > Current recipe object
 * > Shopping list
 * > Linked recipes
 */
const state = {};
window.s = state;

/**
 * ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 * SEARCH CONTROLLER
 * ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 */
const controlSeach = async () => {
    // get query text from view
    const query = searchView.getInput();

    if (query) {
        // save as new Search object to the state
        state.search = new Search(query);

        // Prepare the ui for showing results
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try {
            // Search for recipes
            await state.search.getResults();

            // Render the search results in ui
            removeLoader();
            searchView.clearInput();
            searchView.renderRecipes(state.search.recipes);
        } catch (error) {
            console.log(error);
            alert('Something wrong with search...try again !');
            removeLoader();
        }
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

/**
 * ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 * RECIPE CONTROLLER
 * ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 */
const controlRecipe = async () => {
    // get the recipe id from url
    const id = window.location.hash.replace('#', '');

    if (id) {
        // save as new Recipe object to the state
        state.recipe = new Recipe(id);

        // highlight the selected search result
        if (state.search) searchView.highlightSelected(id);

        // Prepare the ui for showing the recipe
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        try {
            // get the recipe, format ingredients and calculate time, servings
            await state.recipe.getRecipe(); // console.log(state.recipe.ingredients); // testing
            state.recipe.formatIngredients(); // console.log(state.recipe.ingredients); // testing
            state.recipe.calcTime();
            state.recipe.calcServings();

            // Render the recipe  in ui
            removeLoader();
            recipeView.renderRecipe(state.recipe);
        } catch (error) {
            console.log(error);
            alert('Error processing recipe...try again !');
        }
    }
};

// function to be called when the hash value in url changes and
// when the page loads with a hash value in the url
['hashchange', 'load'].forEach(event => {
    window.addEventListener(event, controlRecipe);
});

// handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // decrease servings and ingredients
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');

            //update the ui
            recipeView.updateServingsIngredient(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // increase servings and ingredients
        if (state.recipe.servings < 100) {
            state.recipe.updateServings('inc');

            // update the ui
            recipeView.updateServingsIngredient(state.recipe);
        }
    } else if (e.target.matches('.recipe__btn-add, .recipe__btn-add *')) {
        controlShoppingList();
    }
});

/**
 * ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 * SHOPPING LIST CONTROLLER
 * ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 */
const controlShoppingList = () => {
    // create a empty shopping list if not already created
    if (!state.shoppingList) state.shoppingList = new List();

    // add all the ingredients to the shopping list and render the shopping list to ui
    state.recipe.ingredients.forEach(currIng => {
        listView.renderListItem(state.shoppingList.addItem(currIng.count, currIng.unit, currIng.ingredient));
    });
};

elements.shopping.addEventListener('click', e => {
    // get the id the corresponding item
    const itemId = e.target.closest('.shopping__item').dataset.itemid; // element closest to the target that has the class of 'shopping__item'

    if(e.target.matches('.shopping__delete, .shopping__delete *')){
        // delete the item from the shopping list data structure
        state.shoppingList.deleteItem(itemId);

        // remove the item from ui
        listView.deleteListItem(itemId);
    } else if(e.target.matches('.shopping__count-value')){
        // update the count value in the shopping list
        const val = parseFloat(e.target.value);
        if(val > e.target.step) state.shoppingList.updateCount(itemId, val);
    }
});