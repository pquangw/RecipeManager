const RecipeSort = {
    data() {
        return {
            sortOption: 'random'
        }
    },
    methods: {
        changeSort(option) {
            this.sortOption = option;
            this.$emit('sort-changed', option);
        }
    },
    template: `
        <div class="btn-group flex-wrap">
            <button 
                class="btn btn-sm btn-outline-primary" 
                :class="{ 'active': sortOption === 'random' }"
                @click="changeSort('random')"
            >
                <i class="bi bi-shuffle"></i> Random
            </button>
            <button 
                class="btn btn-sm btn-outline-primary" 
                :class="{ 'active': sortOption === 'popularity' }"
                @click="changeSort('popularity')"
            >
                <i class="bi bi-fire"></i> Popular
            </button>
            <button 
                class="btn btn-sm btn-outline-primary" 
                :class="{ 'active': sortOption === 'alphabetical' }"
                @click="changeSort('alphabetical')"
            >
                <i class="bi bi-sort-alpha-down"></i> A-Z
            </button>
            <button 
                class="btn btn-sm btn-outline-primary" 
                :class="{ 'active': sortOption === 'healthiness' }"
                @click="changeSort('healthiness')"
            >
                <i class="bi bi-heart-pulse"></i> Healthiest
            </button>
            <button 
                class="btn btn-sm btn-outline-primary" 
                :class="{ 'active': sortOption === 'price' }"
                @click="changeSort('price')"
            >
                <i class="bi bi-cash-coin"></i> Cheapest
            </button>
            <button 
                class="btn btn-sm btn-outline-primary" 
                :class="{ 'active': sortOption === 'time' }"
                @click="changeSort('time')"
            >
                <i class="bi bi-clock"></i> Quickest
            </button>
        </div>
    `
};