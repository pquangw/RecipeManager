const RecipeDetail = {
    props: ['recipeId'],
    data() {
        return {
            recipe: null,
            isLoading: false,
            error: null,
            activeTab: 'instructions',
            showModal: false
        }
    },
    methods: {
        async fetchRecipeDetails() {
            this.isLoading = true;
            this.error = null;
            
            try {
                // Simulate fetching from API - in a real app, you would fetch from your backend
                const response = await fetch('recipes.json');
                const allRecipes = await response.json();
                const foundRecipe = allRecipes.find(r => r.id === this.recipeId);
                
                if (foundRecipe) {
                    this.recipe = foundRecipe;
                } else {
                    this.error = 'Recipe not found';
                }
            } catch (err) {
                this.error = 'Failed to load recipe details';
                console.error('Error fetching recipe:', err);
            } finally {
                this.isLoading = false;
            }
        },
        closeModal() {
            this.showModal = false;
            // Clean up modal classes
            document.body.classList.remove('modal-open');
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) backdrop.remove();
            this.$emit('close');
        },
        formatTime(minutes) {
            if (!minutes) return 'N/A';
            const hours = Math.floor(minutes / 60);
            const mins = minutes % 60;
            return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
        },
        formatPrice(price) {
            return price ? `$${price.toFixed(2)}` : 'N/A';
        }
    },
    computed: {
        ingredientsList() {
            if (!this.recipe || !this.recipe.extendedIngredients) return [];
            return this.recipe.extendedIngredients.map(ing => ing.original);
        },
        instructionsList() {
            if (!this.recipe || !this.recipe.analyzedInstructions || 
                !this.recipe.analyzedInstructions[0]) return [];
            return this.recipe.analyzedInstructions[0].steps;
        }
    },
    watch: {
        recipeId: {
            immediate: true,
            handler(newId) {
                if (newId) {
                    this.showModal = true;
                    this.fetchRecipeDetails();
                }
            }
        }
    },
    template: `
        <div v-if="showModal" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
            <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">{{ recipe?.title || 'Recipe Details' }}</h5>
                        <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
                    </div>
                    
                    <div class="modal-body">
                        <div v-if="isLoading" class="text-center py-5">
                            <div class="spinner-border text-primary" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                            <p class="mt-2">Loading recipe details...</p>
                        </div>
                        
                        <div v-else-if="error" class="alert alert-danger">
                            {{ error }}
                        </div>
                        
                        <div v-else-if="recipe" class="recipe-detail">
                            <div class="row mb-4">
                                <div class="col-md-6">
                                    <img :src="recipe.image || 'https://via.placeholder.com/500x300?text=No+Image+Available'" 
                                         class="img-fluid rounded" :alt="recipe.title">
                                </div>
                                <div class="col-md-6">
                                    <div class="d-flex flex-wrap gap-2 mb-3">
                                        <span class="badge bg-primary">{{ recipe.cuisines?.[0] || 'International' }}</span>
                                        <span class="badge bg-secondary">{{ formatTime(recipe.readyInMinutes) }}</span>
                                        <span class="badge bg-success">{{ recipe.servings }} servings</span>
                                        <span class="badge bg-info">{{ formatPrice(recipe.pricePerServing) }} per serving</span>
                                        <span class="badge bg-warning text-dark">
                                            <i class="bi bi-heart-fill"></i> {{ recipe.aggregateLikes || 0 }}
                                        </span>
                                        <span v-if="recipe.healthScore" class="badge bg-danger">
                                            Health Score: {{ recipe.healthScore }}
                                        </span>
                                    </div>
                                    
                                    <p v-html="recipe.summary"></p>
                                    
                                    <div class="d-flex gap-2 mt-3">
                                        <a v-if="recipe.sourceUrl" :href="recipe.sourceUrl" target="_blank" 
                                           class="btn btn-outline-primary btn-sm">
                                            <i class="bi bi-link-45deg"></i> Original Source
                                        </a>
                                        <a v-if="recipe.spoonacularSourceUrl" :href="recipe.spoonacularSourceUrl" 
                                           target="_blank" class="btn btn-outline-secondary btn-sm">
                                            <i class="bi bi-box-arrow-up-right"></i> View on Spoonacular
                                        </a>
                                    </div>
                                </div>
                            </div>
                            
                            <ul class="nav nav-tabs mb-3">
                                <li class="nav-item">
                                    <button class="nav-link" :class="{ 'active': activeTab === 'instructions' }" 
                                            @click="activeTab = 'instructions'">
                                        Instructions
                                    </button>
                                </li>
                                <li class="nav-item">
                                    <button class="nav-link" :class="{ 'active': activeTab === 'ingredients' }" 
                                            @click="activeTab = 'ingredients'">
                                        Ingredients
                                    </button>
                                </li>
                                <li class="nav-item">
                                    <button class="nav-link" :class="{ 'active': activeTab === 'nutrition' }" 
                                            @click="activeTab = 'nutrition'" v-if="recipe.nutrition">
                                        Nutrition
                                    </button>
                                </li>
                            </ul>
                            
                            <div v-show="activeTab === 'instructions'">
                                <ol v-if="instructionsList.length" class="list-group list-group-numbered">
                                    <li v-for="step in instructionsList" :key="step.number" class="list-group-item">
                                        {{ step.step }}
                                    </li>
                                </ol>
                                <div v-else class="alert alert-info">
                                    No instructions available for this recipe.
                                </div>
                            </div>
                            
                            <div v-show="activeTab === 'ingredients'">
                                <ul v-if="ingredientsList.length" class="list-group">
                                    <li v-for="(ingredient, index) in ingredientsList" :key="index" class="list-group-item">
                                        {{ ingredient }}
                                    </li>
                                </ul>
                                <div v-else class="alert alert-info">
                                    No ingredients information available.
                                </div>
                            </div>
                            
                            <div v-show="activeTab === 'nutrition'" v-if="recipe.nutrition">
                                <div class="table-responsive">
                                    <table class="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th>Nutrient</th>
                                                <th>Amount</th>
                                                <th>% Daily Needs</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="nutrient in recipe.nutrition.nutrients" :key="nutrient.name">
                                                <td>{{ nutrient.name }}</td>
                                                <td>{{ nutrient.amount }} {{ nutrient.unit }}</td>
                                                <td>{{ nutrient.percentOfDailyNeeds ? nutrient.percentOfDailyNeeds.toFixed(0) + '%' : 'N/A' }}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `
};