import { elements } from './base';

export const renderListItem = item => {
    const listItemMarkup = `
    <li class="shopping__item" data-itemid=${item.id}>
        <div class="shopping__count">
            <input type="number" value="${item.count}" step="${item.count}" min="${item.count}" class="shopping__count-value">
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

    elements.shopping.insertAdjacentHTML('afterbegin', listItemMarkup);
};

export const deleteListItem = id => {
    const itemToDelete = document.querySelector(`[data-itemid="${id}"]`);
    if (itemToDelete) itemToDelete.parentElement.removeChild(itemToDelete);
};

export const deleteAllItems = () => {
    elements.shopping.innerHTML = '';
}

export const renderDeleteAllBtn = () => {
    const deleteAllBtnMarkup = `
        <button class="shopping__delete-all btn-tiny">
            <svg>
                <use href="img/icons.svg#icon-circle-with-cross"></use>
            </svg>
        </button>
        `;

    elements.shoppingHead.insertAdjacentHTML('beforeend', deleteAllBtnMarkup);
}

export const removeDeleteAllBtn = () => {
    const dltAlBtn = elements.deleteAllBtn;
    dltAlBtn.parentElement.removeChild(dltAlBtn);
}