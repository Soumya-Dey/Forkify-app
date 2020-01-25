import { elements } from './base';

// for getting the query text
export const getInput = () => {
    return elements.searchInput.value;
};

// for clearing the search field
export const clearInput = () => {
    elements.searchInput.value = '';
}

// for clearing the search results
export const clearResults = () => {
    elements.searchResList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
}

// for rendering the whole recipe list 10 per page by default
export const renderRecipes = (recipes, page = 1, resPerPage = 10) => {
    // rendering the actual results
    const start = (page - 1) * resPerPage; // if page = 1, then start = (1 - 1) * 10 = 0
    const end = page * resPerPage; // if page = 1, then start = 1 * 10 = 10

    recipes.slice(start, end).forEach(recipe => {
        renderRecipe(recipe);
    });

    // rendering the pagination buttons
    renderButtons(page, recipes.length, resPerPage);
};

// utility function to render pagination buttons
const renderButtons = (currPage, numOfRes, resPerPage) => {
    const pages = Math.ceil(numOfRes / resPerPage); // Math.ceil(3.4) = 4 i.e next int

    let buttonMarkup;
    if (currPage === 1 && pages > 1) {
        // only forward btn
        buttonMarkup = createBtnMarkup(currPage, 'next');
    } else if (currPage === pages && pages > 1) {
        // only backward btn
        buttonMarkup = createBtnMarkup(currPage, 'prev');
    } else if (currPage < pages) {
        // both btn
        buttonMarkup = `
            ${createBtnMarkup(currPage, 'prev')}
            ${createBtnMarkup(currPage, 'next')}
        `;
    }

    // add the btn arkup to view
    elements.searchResPages.insertAdjacentHTML('afterbegin', buttonMarkup);
};

// utility function to create markup for the buttons
// type = 'next' or 'prev'
const createBtnMarkup = (page, typeOfBtn) => {
    return `
        <button class="btn-inline results__btn--${typeOfBtn}" data-goto="${typeOfBtn === 'prev' ? page - 1 : page + 1}">
            <span>Page ${typeOfBtn === 'prev' ? page - 1 : page + 1}</span>
            <svg class="search__icon">
                <use href="img/icons.svg#icon-triangle-${typeOfBtn === 'prev' ? 'left' : 'right'}"></use>
            </svg>
        </button>
    `;
}

// utility fuction for rendering a single recipe
const renderRecipe = recipe => {
    const recipeMarkup = `
        <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${reduceRecipeTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `;

    elements.searchResList.insertAdjacentHTML('beforeend', recipeMarkup);
};

// utility function to show long title in one line
const reduceRecipeTitle = (title, limit = 18) => {
    const reducedTitle = [];

    if (title.length > limit) {
        title.split(' ').reduce((count, current) => {
            if (count + current.length <= limit) reducedTitle.push(current);

            return count + current.length;
        }, 0 /* this is the initial value of count*/);

        return reducedTitle.join(' ') + "...";
    }

    return title;
};