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

        this.likes.push(like);
        return like;
    }

    deleteLike(id) {
        // returns the index of the element where the function returns true, -1 otherwise
        const index = this.likes.findIndex(curr => {
            return curr.id === id;
        });

        // [2,4,8] splice(1, 2) -> returns [4, 8], original array is [2]
        // [2,4,8] slice(1, 2) -> returns 4, original array is [2,4,8]
        this.likes.splice(index, 1);
    }

    isLiked(id) {
        // returns true if alredy liked, false otherwise
        return this.likes.findIndex(curr => { return curr.id === id; }) !== -1;
    }

    getLikesSize() {
        return this.likes.length;
    }
}