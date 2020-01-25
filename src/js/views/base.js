export const elements = {
    searchForm: document.querySelector('.search'),
    searchInput: document.querySelector('.search__field'),
    searchRes: document.querySelector('.results'),
    searchResList: document.querySelector('.results__list'),
    searchResPages: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe'),
    shopping: document.querySelector('.shopping__list'),
    likesMenu: document.querySelector('.likes__field'),
    likesList: document.querySelector('.likes__list')
};

const elementsStrings = {
    loader: 'loader'
};

export const renderLoader = parentDiv => {
    const loaderHtml = `
        <div class=${elementsStrings.loader}>
            <svg>
                <use href='img/icons.svg#icon-cw'></use>    
            </svg>
        </div>
    `;

    parentDiv.insertAdjacentHTML('afterbegin', loaderHtml);
};

export const removeLoader = () => {
    const loader = document.querySelector(`.${elementsStrings.loader}`);

    if (loader) loader.parentNode.removeChild(loader);
};