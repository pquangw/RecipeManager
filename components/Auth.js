const AuthModalComponent = {
    components: {
        'login-form': LoginComponent,
        'register-form': RegisterComponent
    },
    data() {
        return {
            currentView: 'login', // 'login' or 'register'
            modal: null
        }
    },
    methods: {
        handleAuthSuccess(user) {
            this.$emit('auth-success', user);
            this.closeModal();
        },
        closeModal() {
            if (this.modal) {
                this.modal.hide();
                // Use Bootstrap's method to handle backdrop
                const modalElement = document.getElementById('authModal');
                modalElement.classList.remove('show');
                modalElement.style.display = 'none';
                document.body.classList.remove('modal-open');
                const backdrop = document.querySelector('.modal-backdrop');
                if (backdrop) backdrop.remove();
            }
            this.$router.push('/');
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
            // Initialize modal if not already done
            if (!this.modal) {
                const modalElement = document.getElementById('authModal');
                this.modal = new bootstrap.Modal(modalElement, {
                    backdrop: 'static'
                });
                
                // Handle hidden event to clean up
                modalElement.addEventListener('hidden.bs.modal', () => {
                    this.$emit('close-modal');
                });
            }
            
            this.modal.show();
        },
        switchView(view) {
            this.currentView = view;
            this.$router.push(`/${view}`);
        }
    },
    template: `
        <div class="modal fade" id="authModal" tabindex="-1" aria-hidden="true" data-bs-backdrop="static">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">{{ currentView === 'login' ? 'Login' : 'Register' }}</h5>
                        <button 
                            type="button" 
                            class="btn-close" 
                            data-bs-dismiss="modal" 
                            aria-label="Close" 
                            @click="closeModal"
                        ></button>
                    </div>
                    <div class="modal-body">
                        <login-form 
                            v-if="currentView === 'login'" 
                            @login-success="handleAuthSuccess"
                            @switch-view="switchView"
                        />
                        <register-form 
                            v-if="currentView === 'register'" 
                            @register-success="handleAuthSuccess"
                            @switch-view="switchView"
                        />
                    </div>
                </div>
            </div>
        </div>
    `
};