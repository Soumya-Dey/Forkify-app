import uniqid from 'uniqid';

export default class List {
    constructor() {
        this.items = [];
    }

    addItem(count, unit, ingredient) {
        const item = {
            id: uniqid(),
            count, // means count: count;
            unit,
            ingredient
        };

        this.items.push(item);
        return item;
    }

    deleteItem(id) {
        // returns the index of the element where the function returns true
        const index = this.items.findIndex(curr => {
            return curr.id === id;
        });

        // [2,4,8] splice(1, 2) -> returns [4, 8], original array is [2]
        // [2,4,8] slice(1, 2) -> returns 4, original array is [2,4,8]
        this.items.splice(index, 1);
    }

    deleteAll(){
        this.items = [];
    }

    updateCount(id, newCount) {
        // returns the element itself where the function returns true
        this.items.find(curr => {
            return curr.id === id;
        }).count = newCount;
    }
}