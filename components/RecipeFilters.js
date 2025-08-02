const RecipeFilters = {
    data() {
        return {
            cuisineOptions: [
                'African', 'Asian', 'American', 'British', 'Cajun', 'Caribbean', 'Chinese', 'Eastern European', 'European',
                'French', 'German', 'Greek', 'Indian', 'Irish', 'Italian', 'Japanese', 'Jewish', 'Korean', 'Latin American',
                'Mediterranean', 'Mexican', 'Middle Eastern', 'Nordic', 'Southern', 'Spanish', 'Thai', 'Vietnamese'
            ],
            localFilters: {
                cuisine: '',
                maxCookingTime: 120
            },
            defaultFilters: {
                cuisine: '',
                maxCookingTime: 120
            }
        }
    },
    methods: {
        applyFilters() {
            this.$emit('filters-updated', { ...this.localFilters });
        },
        resetFilters() {
            this.localFilters = { ...this.defaultFilters };
            this.$emit('filters-updated', { ...this.localFilters });
            this.$emit('filters-reset');
        }
    },
    template: `
        <div class="card">
            <div class="card-header bg-primary text-white">
                <h5 class="mb-0">Filters</h5>
            </div>
            <div class="card-body">
                <div class="mb-3">
                    <label for="cuisine-filter" class="form-label">Cuisine</label>
                    <select 
                        id="cuisine-filter" 
                        class="form-select" 
                        v-model="localFilters.cuisine"
                    >
                        <option value="">All Cuisines</option>
                        <option v-for="cuisine in cuisineOptions" :value="cuisine" :key="cuisine">
                            {{ cuisine }}
                        </option>
                    </select>
                </div>

                <div class="mb-3">
                    <label for="time-filter" class="form-label">
                        Max Cooking Time: {{ localFilters.maxCookingTime }} minutes
                    </label>
                    <input 
                        type="range" 
                        id="time-filter" 
                        class="form-range" 
                        min="10" 
                        max="120" 
                        step="5"
                        v-model.number="localFilters.maxCookingTime"
                    >
                    <div class="d-flex justify-content-between small text-muted">
                        <span>10 min</span>
                        <span>120 min</span>
                    </div>
                </div>

                <div class="d-grid gap-2">
                    <button class="btn btn-primary" @click="applyFilters">
                        <i class="bi bi-check-circle"></i> Apply Filters
                    </button>
                    <button class="btn btn-outline-secondary" @click="resetFilters">
                        <i class="bi bi-arrow-counterclockwise"></i> Reset Filters
                    </button>
                </div>
            </div>
        </div>
    `
};