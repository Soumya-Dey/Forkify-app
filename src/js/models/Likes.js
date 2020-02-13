export default class Likes {
    constructor() {
        this.likes = [];
    }

    addLike(id, title, author, image) {
        const like = {
            id,
            title,
            author,
            image
        }

        // push the newly liked recipe to the likes array and persist the data to localStorage
        this.likes.push(like);
        this.persistData();


        return like;
    }

    deleteLike(id) {
        // returns the index of the element where the function returns true, -1 otherwise
        const index = this.likes.findIndex(curr => {
            return curr.id === id;
        });

        // [2,4,8] splice(1, 2) -> returns [4, 8], original array is [2]
        // [2,4,8] slice(1, 2) -> returns 4, original array is [2,4,8]
        // remove the recipe from the likes array and persist the data to localStorage
        this.likes.splice(index, 1);
        this.persistData();
    }

    isLiked(id) {
        // returns true if alredy liked, false otherwise
        return this.likes.findIndex(curr => { return curr.id === id; }) !== -1;
    }

    getLikesSize() {
        return this.likes.length;
    }

    persistData() {
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    restoreData() {
        const data = JSON.parse(localStorage.getItem('likes'));

        // restoring the likes data to likes list
        if (data) this.likes = data;
    }
}