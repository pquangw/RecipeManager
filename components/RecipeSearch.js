const RecipeSearch = {
    emits: ['search', 'reset'],
    data() {
        return {
            searchQuery: ''
        }
    },
    methods: {
        search() {
            if (this.searchQuery.trim()) {
                this.$emit('search', this.searchQuery.trim());
            } else {
                this.resetSearch();
            }
        },
        resetSearch() {
            this.searchQuery = '';
            this.$emit('reset');
        }
    },
    template: `
        <div class="input-group">
            <input 
                type="text" 
                class="form-control" 
                placeholder="Search recipes..." 
                v-model="searchQuery"
                @keyup.enter="search"
            >
            <button class="btn btn-primary" @click="search">
                <i class="bi bi-search"></i> Search
            </button>
            <button 
                class="btn btn-outline-secondary" 
                @click="resetSearch"
                :disabled="!searchQuery"
                title="Reset search"
            >
                <i class="bi bi-x-lg"></i>
            </button>
        </div>
    `
};