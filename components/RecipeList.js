const RecipeList = {
    props: {
        recipes: Array,
        isLoading: Boolean,
        sortOption: String
    },
    components: {
        'recipe-card': RecipeCard
    },
    emits: ['view-recipe'],
    template: `
        <div class="row">
            <div class="col-12 mb-3">
                <div v-if="isLoading" class="text-center my-5">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <p class="mt-2">Loading recipes...</p>
                </div>
            </div>
            <div class="col-sm-6 col-lg-4 mb-4" v-for="recipe in recipes" :key="recipe.id">
                <recipe-card 
                    :recipe="recipe" 
                    :sort-option="sortOption"
                    @view-recipe="$emit('view-recipe', $event)">
                </recipe-card>
            </div>
        </div>
    `
};