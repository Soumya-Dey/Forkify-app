import axios from 'axios';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const result = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);

            this.title = result.data.recipe.title;
            this.author = result.data.recipe.publisher;
            this.image = result.data.recipe.image_url;
            this.url = result.data.recipe.source_url;
            this.ingredients = result.data.recipe.ingredients;

            // console.log(result);
        } catch (error) {
            console.log(error);
            alert('Something went wrong! :(');
        }
    }

    calcTime(){
        // Assuming that we need 15 min for each 3 ingredients
        this.time = (Math.ceil(this.ingredients.length / 3)) * 15;
    }

    calcServings(){
        this.servings = 4;
    }
}