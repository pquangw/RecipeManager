const AuthModalComponent = {
    components: {
        'login-form': LoginComponent,
        'register-form': RegisterComponent
    },
    data() {
        return {
            isLoginView: true,
            forceView: null // Added to force a specific view
        }
    },
    methods: {
        handleAuthSuccess(user) {
            this.$emit('auth-success', user);
        },
        closeModal() {
            const modal = bootstrap.Modal.getInstance(document.getElementById('authModal'));
            modal.hide();
            this.forceView = null; // Reset forced view when modal closes
        },
        showLogin() {
            this.forceView = 'login';
            this.showModal();
        },
        showRegister() {
            this.forceView = 'register';
            this.showModal();
        },
        showModal() {
            const modal = new bootstrap.Modal(document.getElementById('authModal'));
            modal.show();
        }
    },
    computed: {
        currentView() {
            // Use forced view if set, otherwise fall back to default isLoginView
            if (this.forceView === 'login') return true;
            if (this.forceView === 'register') return false;
            return this.isLoginView;
        }
    },
    template: `
        <div class="modal fade" id="authModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">{{ currentView ? 'Login' : 'Register' }}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="closeModal"></button>
                    </div>
                    <div class="modal-body">
                        <login-form 
                            v-if="currentView" 
                            @login-success="handleAuthSuccess"
                            @switch-to-register="isLoginView = false"
                            @close-modal="closeModal"
                        />
                        <register-form 
                            v-else 
                            @register-success="handleAuthSuccess"
                            @switch-to-login="isLoginView = true"
                            @close-modal="closeModal"
                        />
                    </div>
                </div>
            </div>
        </div>
    `
};