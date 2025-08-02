const RegisterComponent = {
    template: `
        <div class="auth-form">
            <h3>Register</h3>
            <form @submit.prevent="handleRegister">
                <div class="mb-3">
                    <label for="register-name" class="form-label">Name</label>
                    <input type="text" class="form-control" id="register-name" v-model="name" required>
                </div>
                <div class="mb-3">
                    <label for="register-email" class="form-label">Email</label>
                    <input type="email" class="form-control" id="register-email" v-model="email" required>
                </div>
                <div class="mb-3">
                    <label for="register-password" class="form-label">Password</label>
                    <input type="password" class="form-control" id="register-password" v-model="password" required>
                </div>
                <button type="submit" class="btn btn-primary">Register</button>
                <p class="mt-2">Already have an account? 
                    <a href="#" @click.prevent="$emit('switch-view', 'login')">Login</a>
                </p>
            </form>
        </div>
    `,
    data() {
        return {
            name: '',
            email: '',
            password: ''
        }
    },
    methods: {
        handleRegister() {
            const users = JSON.parse(localStorage.getItem('users')) || [];
            
            if (users.some(u => u.email === this.email)) {
                alert('Email already registered');
                return;
            }
            
            const newUser = {
                id: Date.now(),
                name: this.name,
                email: this.email,
                password: this.password,
                profilePic: 'https://via.placeholder.com/150' // Default profile picture
            };
            
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(newUser));
            
            this.$emit('register-success', newUser);
            this.$emit('close-modal');
        },
        switchToLogin() {
            this.$emit('switch-to-login');
        }
    }
};