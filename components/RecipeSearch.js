const RecipeSearch = {
    emits: ['search'],
    data() {
        return {
            searchQuery: ''
        }
    },
    methods: {
        search() {
            if (this.searchQuery.trim()) {
                this.$emit('search', this.searchQuery.trim());
            }
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
        </div>
    `
};