// Api used --> https://forkify-api.herokuapp.com/

import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import { elements, renderLoader, removeLoader } from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';

/**Global app state
 * > Search object
 * > Current recipe object
 * > Shopping list
 * > Liked recipes
 */
const state = {};




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
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
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

        // add items to the shopping list
        controlShoppingList();

        // add transform transition to the heading
        elements.listHeading.classList.add('heading_transform');
        elements.shoppingHead.classList.add('heading_container');

        // add delete all button, remove first if already exists 
        listView.removeDeleteAllBtn();
        listView.renderDeleteAllBtn();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        // add recipies to the likes list
        controlLikesList();
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

    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // delete the item from the shopping list data structure
        state.shoppingList.deleteItem(itemId);

        // remove the item from ui
        listView.deleteListItem(itemId);
    } else if (e.target.matches('.shopping__count-value')) {
        // update the count value in the shopping list
        const val = parseFloat(e.target.value);
        if (val > e.target.step) state.shoppingList.updateCount(itemId, val);
    }
});

elements.shoppingHead.addEventListener('click', e => {
    if(e.target.matches('.shopping__delete-all, .shopping__delete-all *')){
        if(state.shoppingList){
            // delete all items from the shopping list data structure
            state.shoppingList.deleteAll();

            // remove all shopping list items from ui
            listView.deleteAllItems();
        }
    }
})




/**
 * ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 * LIKES CONTROLLER
 * ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 */
const controlLikesList = () => {
    // create a empty likes list if not already created
    if (!state.likes) state.likes = new Likes();

    const currId = state.recipe.id;

    // add the recipe to the likes list if not liked already,
    // or remove it from the likes list if already liked
    if (!state.likes.isLiked(currId)) {
        // add the recipe to the likes list data structure
        const newLike = state.likes.addLike(currId, state.recipe.title, state.recipe.author, state.recipe.image);

        // toggle the likes button
        likesView.toggleLikeBtn(state.likes.isLiked(currId));

        // add the recipe to the likes list in ui
        likesView.renderLike(newLike);
    } else {
        // remove the recipe from the likes list data structure
        state.likes.deleteLike(currId);

        // toggle the likes button
        likesView.toggleLikeBtn(state.likes.isLiked(currId));

        // remove the recipe from the likes list in ui
        likesView.removeLike(currId);
    }
    likesView.toggleLikesMenu(state.likes.getLikesSize());
}

window.addEventListener('load', () => {
    state.likes = new Likes();

    // resote the likes data from localStorae
    state.likes.restoreData();

    likesView.toggleLikesMenu(state.likes.getLikesSize());

    // render the existing likes
    state.likes.likes.forEach(like => {
        likesView.renderLike(like);
    });
});