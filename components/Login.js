const LoginComponent = {
    template: `
        <div class="auth-form">
            <h3>Login</h3>
            <form @submit.prevent="handleLogin">
                <div class="mb-3">
                    <label for="login-email" class="form-label">Email</label>
                    <input type="email" class="form-control" id="login-email" v-model="email" required>
                </div>
                <div class="mb-3">
                    <label for="login-password" class="form-label">Password</label>
                    <input type="password" class="form-control" id="login-password" v-model="password" required>
                </div>
                <button type="submit" class="btn btn-primary">Login</button>
                <p class="mt-2">Don't have an account? 
                    <a href="#" @click.prevent="$emit('switch-view', 'register')">Register</a>
                </p>
            </form>
        </div>
    `,
    data() {
        return {
            email: '',
            password: ''
        }
    },
    methods: {
        handleLogin() {
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(u => u.email === this.email && u.password === this.password);
            
            if (user) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.$emit('login-success', user);
                this.$emit('close-modal');
            } else {
                alert('Invalid email or password');
            }
        },
        switchToRegister() {
            this.$emit('switch-to-register');
        }
    }
};