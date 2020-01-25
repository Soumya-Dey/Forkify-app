import axios from 'axios';

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults() {
        try {
            // returns a json from the api
            const result = await axios('https://forkify-api.herokuapp.com/api/search' + '?q=' + this.query);
            this.recipes = result.data.recipes;

            // console.log(this.recipes);
        } catch (error) {
            alert(error);
        }
    }
}