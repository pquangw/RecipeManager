const AuthModalComponent = {
    components: {
        'login-form': LoginComponent,
        'register-form': RegisterComponent
    },
    data() {
        return {
            currentView: 'login' // 'login' or 'register'
        }
    },
    methods: {
        handleAuthSuccess(user) {
            this.$emit('auth-success', user);
        },
        closeModal() {
            const modal = bootstrap.Modal.getInstance(document.getElementById('authModal'));
            modal.hide();
        },
        showLogin() {
            this.currentView = 'login';
            this.showModal();
        },
        showRegister() {
            this.currentView = 'register';
            this.showModal();
        },
        showModal() {
            const modal = new bootstrap.Modal(document.getElementById('authModal'));
            modal.show();
        },
        switchView(view) {
            this.currentView = view;
        }
    },
    template: `
        <div class="modal fade" id="authModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">{{ currentView === 'login' ? 'Login' : 'Register' }}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="closeModal"></button>
                    </div>
                    <div class="modal-body">
                        <login-form 
                            v-if="currentView === 'login'" 
                            @login-success="handleAuthSuccess"
                            @switch-view="switchView"
                            @close-modal="closeModal"
                        />
                        <register-form 
                            v-if="currentView === 'register'" 
                            @register-success="handleAuthSuccess"
                            @switch-view="switchView"
                            @close-modal="closeModal"
                        />
                    </div>
                </div>
            </div>
        </div>
    `
};