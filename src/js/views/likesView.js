import { elements } from './base';
import { reduceRecipeTitle } from './searchView';

// toggles the state of the like button i.e filled when liked, outlined otherwise
export const toggleLikeBtn = isLiked => {
    const btnSvgStr = isLiked ? 'icon-heart' : 'icon-heart-outlined';

    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${btnSvgStr}`);
};

// shows the likes menu only when there are liked recipies, hides otherwise
export const toggleLikesMenu = likesSize => {
    elements.likesMenu.style.visibility = likesSize > 0 ? 'visible' : 'hidden';
};

// for rendering the liked recipe in the list
export const renderLike = like => {
    const likeMarkup = `
    <li>
        <a class="likes__link" href="#${like.id}">
            <figure class="likes__fig">
                <img src="${like.image}" alt="${like.title}">
            </figure>
            <div class="likes__data">
                <h4 class="likes__name">${reduceRecipeTitle(like.title)}</h4>
                <p class="likes__author">${like.author}</p>
            </div>
        </a>
    </li>
    `;

    elements.likesList.insertAdjacentHTML('beforeend', likeMarkup);
};

// for removing the recipe from the list whrn unliked
export const removeLike = id => {
    const itemToDelete = document.querySelector(`.likes__link[href="#${id}"]`).parentElement;
    itemToDelete.parentElement.removeChild(itemToDelete);
};