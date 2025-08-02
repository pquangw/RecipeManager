const RecipeCard = {
    props: ['recipe', 'sortOption'],
    methods: {
        getRecipeImage(recipe) {
            return recipe.image || 'https://via.placeholder.com/500x300?text=No+Image+Available';
        },
        getFirstCuisine(recipe) {
            return recipe.cuisines?.[0] || 'International';
        },
        formatPrice(price) {
            return price ? `$${price.toFixed(2)}` : 'N/A';
        }
    },
    template: `
        <div class="card h-100">
            <img :src="getRecipeImage(recipe)" class="card-img-top" :alt="recipe.title">
            <div class="card-body">
                <h5 class="card-title">{{ recipe.title }}</h5>
                
                <div class="d-flex justify-content-between mb-2">
                    <span class="badge bg-secondary">{{ getFirstCuisine(recipe) }}</span>
                    <span class="text-muted">{{ recipe.readyInMinutes }} mins</span>
                </div>
                
                <!-- New health and price indicators -->
                <div class="d-flex justify-content-between small mb-2">
                    <span v-if="sortOption === 'healthiness'" class="text-success">
                        <i class="bi bi-heart-pulse"></i> {{ recipe.healthScore || 'N/A' }}
                    </span>
                    <span v-if="sortOption === 'price'" class="text-primary">
                        <i class="bi bi-cash-coin"></i> {{ formatPrice(recipe.pricePerServing) }}
                    </span>
                </div>
                
                <p class="card-text text-truncate">{{ recipe.summary.replace(/<[^>]*>/g, '').substring(0, 100) }}...</p>
            </div>
            <div class="card-footer bg-transparent">
                <button class="btn btn-sm btn-outline-primary" @click="$emit('view-recipe', recipe.id)">
                    View Recipe
                </button>
                <span class="ms-2 text-muted">
                    <i class="bi bi-heart-fill text-danger"></i> {{ recipe.aggregateLikes || 0 }}
                </span>
            </div>
        </div>
    `
};