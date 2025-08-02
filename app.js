const { createApp } = Vue;

const app = createApp({
    components: {
        'recipe-card': RecipeCard,
        'recipe-list': RecipeList,
        'recipe-filters': RecipeFilters,
        'recipe-search': RecipeSearch,
        'recipe-sort': RecipeSort,
        paginate: VuejsPaginateNext,
        'auth-modal': AuthModalComponent,
        'recipe-detail': RecipeDetail
    },
    data() {
        return {
            recipes: [],
            allRecipes: [],
            filteredRecipeCount: 0,
            isLoading: false,
            activeFilters: {
                cuisine: '',
                maxCookingTime: 120
            },
            currentSort: 'random',
            currentPage: 1,
            pageCount: 1,
            perPage: 12,
            forcePage: 0,
            currentUser: null,
            showDropdown: false,
            selectedRecipeId: null
        }
    },
    computed: {
        filteredRecipes() {
            let recipes = this.recipes;
            
            // Apply filters
            recipes = recipes.filter(recipe => {
                const matchesCuisine = !this.activeFilters.cuisine || 
                                     (recipe.cuisines && recipe.cuisines.some(c => c.includes(this.activeFilters.cuisine)));
                const matchesTime = recipe.readyInMinutes <= this.activeFilters.maxCookingTime;
                return matchesCuisine && matchesTime;
            });
            
            // Apply sorting
            switch(this.currentSort) {
                case 'popularity':
                    return [...recipes].sort((a, b) => (b.aggregateLikes || 0) - (a.aggregateLikes || 0));
                case 'alphabetical':
                    return [...recipes].sort((a, b) => a.title.localeCompare(b.title));
                case 'healthiness':
                    return [...recipes].sort((a, b) => (b.healthScore || 0) - (a.healthScore || 0));
                case 'price':
                    return [...recipes].sort((a, b) => (a.pricePerServing || 0) - (b.pricePerServing || 0));
                case 'time':
                    return [...recipes].sort((a, b) => (a.readyInMinutes || 0) - (b.readyInMinutes || 0));
                case 'random':
                default:
                    return this.shuffleArray([...recipes]);
            }
        },
        showingCount() {
            const total = this.filteredRecipeCount;
            const showing = this.filteredRecipes.length;
            const start = (this.currentPage - 1) * this.perPage + 1;
            const end = Math.min(start + this.perPage - 1, total);
            
            if (this.currentSort === 'random') {
                return `Showing ${showing} random recipes`;
            }
            return `Showing ${start}-${end} of ${total} recipes`;
        }
    },
    methods: {
        async loadRecipes() {
            this.isLoading = true;
            try {
                const response = await fetch('recipes.json');
                this.allRecipes = await response.json();
                this.filteredRecipeCount = this.allRecipes.length;
                this.fetchRecipes();
            } catch (error) {
                console.error('Error loading recipes:', error);
            } finally {
                this.isLoading = false;
            }
        },
        

        fetchRecipes(sortOption = this.currentSort, page = this.currentPage) {
            this.isLoading = true;
    
            try {
                let recipes = [...this.allRecipes];
                
                // Apply all filters (including search)
                recipes = recipes.filter(recipe => {
                    const matchesSearch = !this.searchQuery || 
                                        recipe.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                                        (recipe.cuisines && recipe.cuisines.some(c => c.toLowerCase().includes(this.searchQuery.toLowerCase())));
                    const matchesCuisine = !this.activeFilters.cuisine || 
                                        (recipe.cuisines && recipe.cuisines.some(c => c.includes(this.activeFilters.cuisine)));
                    const matchesTime = recipe.readyInMinutes <= this.activeFilters.maxCookingTime;
                    return matchesSearch && matchesCuisine && matchesTime;
                });
                
                this.filteredRecipeCount = recipes.length;
                
                // Apply sorting for non-random options
                if (sortOption !== 'random') {
                    switch(sortOption) {
                        case 'popularity':
                            recipes.sort((a, b) => (b.aggregateLikes || 0) - (a.aggregateLikes || 0));
                            break;
                        case 'alphabetical':
                            recipes.sort((a, b) => a.title.localeCompare(b.title));
                            break;
                        case 'healthiness':
                            recipes.sort((a, b) => (b.healthScore || 0) - (a.healthScore || 0));
                            break;
                        case 'price':
                            recipes.sort((a, b) => (a.pricePerServing || 0) - (b.pricePerServing || 0));
                            break;
                        case 'time':
                            recipes.sort((a, b) => (a.readyInMinutes || 0) - (b.readyInMinutes || 0));
                            break;
                    }
                }
                
                // Calculate pagination
                this.pageCount = Math.ceil(recipes.length / this.perPage);
                
                // Handle pagination
                if (sortOption !== 'random') {
                    const startIndex = (page - 1) * this.perPage;
                    recipes = recipes.slice(startIndex, startIndex + this.perPage);
                } else {
                    // For random, just take a random sample
                    recipes = this.shuffleArray(recipes).slice(0, this.perPage);
                    this.pageCount = 1;
                }
                
                this.recipes = recipes;
                this.currentSort = sortOption;
                this.currentPage = page;
                this.forcePage = page - 1; // Update forcePage to match current page
                
            } catch (error) {
                console.error('Error processing recipes:', error);
            } finally {
                this.isLoading = false;
            }
        },
        handleSearch(query) {
            this.currentPage = 1;
            this.forcePage = 0;
            this.searchQuery = query;
            this.fetchRecipes(this.currentSort, 1);
        },

        handleSortChanged(sortOption) {
            this.currentPage = 1;
            this.forcePage = 0; // Reset to first page
            this.fetchRecipes(sortOption, 1);
        },

        handlePageChange(page) {
            this.currentPage = page;
            this.forcePage = page - 1; // Update forcePage when page changes
            this.fetchRecipes(this.currentSort, page);
        },

        handleRandomClick() {
            this.currentPage = 1;
            this.forcePage = 0;
            this.fetchRecipes('random');
        },

        shuffleArray(array) {
            const newArray = [...array];
            for (let i = newArray.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
            }
            return newArray;
        },

        handleFiltersUpdated(filters) {
            this.activeFilters = filters;
            this.currentPage = 1;
            this.forcePage = 0;
            this.fetchRecipes(this.currentSort, 1);
        },
                
        viewRecipe(id) {
            this.selectedRecipeId = id;
        },
        toggleDropdown() {
            this.showDropdown = !this.showDropdown;
        },
        closeDropdown() {
            this.showDropdown = false;
        },
        handleAuthSuccess(user) {
            this.currentUser = user;
            this.closeDropdown();
        },
        logout() {
            localStorage.removeItem('currentUser');
            this.currentUser = null;
            this.closeDropdown();
        }
    },
    mounted() {
        // Load user if logged in
        const user = localStorage.getItem('currentUser');
        if (user) {
            this.currentUser = JSON.parse(user);
        }
        
        this.loadRecipes();
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.$refs.profileContainer?.contains(e.target)) {
                this.showDropdown = false;
            }
        });
    },
    template: `
        <div class="container">
            <header class="bg-primary text-white p-3 mb-4 position-relative">
            <div class="d-flex justify-content-between align-items-center">
                <h1 class="mb-0">Recipe Manager</h1>
                <div class="position-relative" ref="profileContainer">
                    <div v-if="currentUser" class="dropdown" :class="{ show: showDropdown }">
                        <div class="d-flex align-items-center" style="cursor: pointer;" @click.stop="toggleDropdown">
                            <span class="me-2">{{ currentUser.name }}</span>
                            <img 
                                :src=""
                                class="rounded-circle profile-pic" 
                                width="40" 
                                height="40"
                            >
                        </div>
                        <div 
                            v-if="showDropdown" 
                            class="dropdown-menu show position-absolute end-0 mt-2"
                            style="min-width: 200px; z-index: 1000;"
                            @click.stop
                        >
                            <div class="p-3">
                                <button 
                                    class="btn btn-danger w-100" 
                                    @click="logout"
                                >
                                    <i class="bi bi-box-arrow-right"></i> Logout
                                </button>
                            </div>
                        </div>
                    </div>
                    <div v-else class="dropdown" :class="{ show: showDropdown }">
                        <button class="btn btn-light" @click.stop="toggleDropdown">
                            <i class="bi bi-person-circle"></i> Account
                        </button>
                        <div 
                            v-if="showDropdown" 
                            class="dropdown-menu show position-absolute end-0 mt-2"
                            style="min-width: 200px; z-index: 1000;"
                            @click.stop
                        >
                            <div class="p-3">
                                <button 
                                    class="btn btn-primary w-100 mb-2" 
                                    @click="$refs.authModal.showLogin(); showDropdown = false"
                                >
                                    Login
                                </button>
                                <button 
                                    class="btn btn-secondary w-100" 
                                    @click="$refs.authModal.showRegister(); showDropdown = false"
                                >
                                    Register
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>

        <auth-modal ref="authModal" @auth-success="handleAuthSuccess" />

            <main class="container">
                <div class="row mb-4">
                    <div class="col-12">
                        <recipe-search @search="handleSearch" />
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-3 mb-4">
                        <recipe-filters 
                            @filters-updated="handleFiltersUpdated"
                            @filters-reset="handleFiltersReset"
                        />
                    </div>

                    <div class="col-md-9">
                        <div class="row mb-3">
                            <div class="col-12">
                                <div class="d-flex justify-content-between align-items-center">
                                    <div class="text-muted">{{ showingCount }}</div>
                                    <recipe-sort @sort-changed="handleSortChanged" />
                                </div>
                            </div>
                        </div>

                        <recipe-list 
                            :recipes="filteredRecipes" 
                            :is-loading="isLoading"
                            :sort-option="currentSort"
                            @view-recipe="viewRecipe"
                        />

                        <div class="d-flex justify-content-center mt-4">
                            <template v-if="currentSort !== 'random' && pageCount > 1">
                                <paginate
                                    v-model="currentPage"
                                    :page-count="pageCount"
                                    :click-handler="handlePageChange"
                                    :prev-text="'Prev'"
                                    :next-text="'Next'"
                                    :container-class="'pagination'"
                                    :page-class="'page-item'"
                                    :page-link-class="'page-link'"
                                    :active-class="'active'"
                                    :prev-class="'page-item'"
                                    :next-class="'page-item'"
                                    :disabled-class="'disabled'"
                                    :break-view-class="'page-item disabled'"
                                    :break-view-link-class="'page-link'"
                                    :force-page="forcePage"
                                />
                            </template>
                            <template v-else-if="currentSort === 'random'">
                                <button class="btn btn-primary" @click="handleRandomClick">
                                    <i class="bi bi-shuffle"></i> Randomize
                                </button>
                            </template>
                        </div>
                    </div>
                </div>
                <recipe-detail 
                    v-if="selectedRecipeId" 
                    :recipe-id="selectedRecipeId" 
                    @close="selectedRecipeId = null"
                />
            </main>
        </div>
    `
});

app.mount('#app');