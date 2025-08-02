const RecipeCard = {
    props: ['recipe', 'sortOption'],
    data() {
        return {
            localFavorites: JSON.parse(localStorage.getItem('favorites')) || {}
        }
    },
    computed: {
        isFavorite() {
            if (!this.$root.currentUser) return false;
            return this.localFavorites[this.$root.currentUser.id]?.includes(this.recipe.id) || false;
        },
        totalLikes() {
            let count = this.recipe.aggregateLikes || 0;
            Object.keys(this.localFavorites).forEach(userId => {
                if (this.localFavorites[userId].includes(this.recipe.id)) {
                    count++;
                }
            });
            return count;
        }
    },
    methods: {
        getRecipeImage(recipe) {
            return recipe.image || 'https://via.placeholder.com/500x300?text=No+Image+Available';
        },
        getFirstCuisine(recipe) {
            return recipe.cuisines?.[0] || 'International';
        },
        formatPrice(price) {
            return price ? `$${price.toFixed(2)}` : 'N/A';
        },
        toggleFavorite() {
            if (!this.$root.currentUser) return;
            
            const userId = this.$root.currentUser.id;
            
            // Create a new object to ensure reactivity
            const newFavorites = {...this.localFavorites};
            
            if (!newFavorites[userId]) {
                newFavorites[userId] = [];
            }
            
            const index = newFavorites[userId].indexOf(this.recipe.id);
            if (index === -1) {
                newFavorites[userId].push(this.recipe.id);
            } else {
                newFavorites[userId].splice(index, 1);
            }
            
            // Update both local state and localStorage
            this.localFavorites = newFavorites;
            localStorage.setItem('favorites', JSON.stringify(newFavorites));
            
            // Emit an event to parent component if needed
            this.$emit('favorite-toggled');
        }
    },
    watch: {
        '$root.currentUser': {
            immediate: true,
            handler() {
                // Refresh favorites when user changes
                this.localFavorites = JSON.parse(localStorage.getItem('favorites')) || {};
            }
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
                <button 
                    class="btn btn-sm ms-2" 
                    :class="{'btn-danger': isFavorite, 'btn-outline-secondary': !isFavorite}"
                    @click="toggleFavorite"
                    :disabled="!$root.currentUser"
                    :title="!$root.currentUser ? 'Login to favorite' : ''"
                >
                    <i class="bi bi-heart-fill"></i> {{ totalLikes }}
                </button>
            </div>
        </div>
    `
};