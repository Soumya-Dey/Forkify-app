import { elements } from './base';
import { Fraction } from 'fractional';

// for clearing the recipe
export const clearRecipe = () => {
    elements.recipe.innerHTML = '';
};

// for rendering the selected recipe
export const renderRecipe = (recipe, isLiked) => {
    const recipeInfoMarkup = `
            <figure class="recipe__fig">
                <img src="${recipe.image}" alt="${recipe.title}" class="recipe__img">
                <h1 class="recipe__title">
                    <span>${recipe.title}</span>
                </h1>
            </figure>
            <div class="recipe__details">
                <div class="recipe__info">
                    <svg class="recipe__info-icon">
                        <use href="img/icons.svg#icon-stopwatch"></use>
                    </svg>
                    <span class="recipe__info-data recipe__info-data--minutes">${recipe.time}</span>
                    <span class="recipe__info-text"> minutes</span>
                </div>
                <div class="recipe__info">
                    <svg class="recipe__info-icon">
                        <use href="img/icons.svg#icon-man"></use>
                    </svg>
                    <span class="recipe__info-data recipe__info-data--people">${recipe.servings}</span>
                    <span class="recipe__info-text"> servings</span>

                    <div class="recipe__info-buttons">
                        <button class="btn-tiny btn-decrease">
                            <svg>
                                <use href="img/icons.svg#icon-circle-with-minus"></use>
                            </svg>
                        </button>
                        <button class="btn-tiny btn-increase">
                            <svg>
                                <use href="img/icons.svg#icon-circle-with-plus"></use>
                            </svg>
                        </button>
                    </div>

                </div>
                <button class="recipe__love">
                    <svg class="header__likes">
                        <use href="img/icons.svg#${isLiked ? 'icon-heart' : 'icon-heart-outlined'}"></use>
                    </svg>
                </button>
            </div>



            <div class="recipe__ingredients">
                <ul class="recipe__ingredient-list">
                    ${recipe.ingredients.map(el => generateIngredientMarkup(el)).join('')}
                </ul>

                <button class="btn-small recipe__btn recipe__btn-add">
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-shopping-cart"></use>
                    </svg>
                    <span>Add to shopping list</span>
                </button>
            </div>

            <div class="recipe__directions">
                <h2 class="heading-2">How to cook it</h2>
                <p class="recipe__directions-text">
                    This recipe was carefully designed and tested by
                    <span class="recipe__by">${recipe.author}</span>. Please check out directions at their website.
                </p>
                <a class="btn-small recipe__btn" href="${recipe.url}" target="_blank">
                    <span>Directions</span>
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-triangle-right"></use>
                    </svg>
                </a>
            </div>`;

    elements.recipe.insertAdjacentHTML('afterbegin', recipeInfoMarkup);
};

export const updateServingsIngredient = recipe => {
    // update servings
    document.querySelector('.recipe__info-data--people').textContent = recipe.servings;

    // update ingredient counts
    document.querySelectorAll('.recipe__count').forEach((curr, index) => {
        curr.textContent = formatCountFraction(recipe.ingredients[index].count);
    });
};

// utility function for creating markup for each ingredient list item
const generateIngredientMarkup = ingredient => {
    return `
        <li class="recipe__item">
            <svg class="recipe__icon">
                <use href="img/icons.svg#icon-check"></use>
            </svg>
            <div class="recipe__count">${formatCountFraction(ingredient.count)}</div>
            <div class="recipe__ingredient">
                <span class="recipe__unit">${ingredient.unit}</span>
                ${ingredient.ingredient}
            </div>
        </li>`;
};

// utility function for converting floats to a fraction i.e 3.5 -> 3 1/2 or 0.5 -> 1/2
const formatCountFraction = count => {
    if (count) {
        let newCount;
        if (count.toString().includes('.')) {
            newCount = parseFloat(count.toFixed(1)); // 1.3333333 -> 1.3
            const [intPart, decPart] = newCount.toString().split('.').map(el => parseInt(el)); // 3.5 -> ['3', '5'] -> [3, 5]

            // for 0.5, 0.3, 0.7 etc
            if (intPart === 0) {
                const fraction = new Fraction(newCount); // Library used -> https://github.com/ekg/fraction.js/
                return `${fraction.numerator}/${fraction.denominator}`;
            }
            // for 1.2, 2.5 etc
            else {
                const fraction = new Fraction(newCount - intPart);
                return `${intPart} ${fraction.numerator}/${fraction.denominator}`;
            }
        }
        return count;
    }
    return '';
}