import { elements } from './base';

export const renderListItem = item => {
    const listItemMarkup = `
    <li class="shopping__item" data-itemid=${item.id}>
        <div class="shopping__count">
            <input type="number" value="${item.count}" step="${item.count}">
            <p>${item.unit}</p>
        </div>
        <p class="shopping__description">${item.ingredient}</p>
        <button class="shopping__delete btn-tiny">
            <svg>
                <use href="img/icons.svg#icon-circle-with-cross"></use>
            </svg>
        </button>
    </li>
    `;

    elements.shopping.insertAdjacentElement('beforeend', listItemMarkup);
};

export const deleteListItem = id => {
    const itemToDelete = document.querySelector(`[data-itemid="${id}"]`);
    itemToDelete.parentElement.removeChild(itemToDelete);
};