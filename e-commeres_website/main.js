 // DOM Elements
        const loginBtn = document.getElementById('loginBtn');
        const registerBtn = document.getElementById('registerBtn');
        const authModal = document.getElementById('authModal');
        const closeModal = document.querySelector('.modal .close');
        const showRegister = document.getElementById('showRegister');
        const showLogin = document.getElementById('showLogin');
        const selectRoleBtns = document.querySelectorAll('.select-role');
        const userRoleInput = document.getElementById('userRole');
        const regRoleInput = document.getElementById('regRole');
        const sellBtn = document.getElementById('sellBtn');
        const tabBtns = document.querySelectorAll('.tab-btn');
        const loginFormElement = document.getElementById('loginFormElement');
        const registerFormElement = document.getElementById('registerFormElement');
        const farmerFields = document.getElementById('farmerFields');
        const googleLoginBtn = document.getElementById('googleLogin');
        const facebookLoginBtn = document.getElementById('facebookLogin');

        // Users data in localStorage
        if (!localStorage.getItem('users')) {
            localStorage.setItem('users', JSON.stringify([]));
        }

        // Show Login Modal
        if (loginBtn) {
            loginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                authModal.style.display = 'flex';
                document.getElementById('loginForm').style.display = 'block';
                document.getElementById('registerForm').style.display = 'none';
                
                // Update active tab
                tabBtns.forEach(t => t.classList.remove('active'));
                document.querySelector('.tab-btn[data-tab="login"]').classList.add('active');
            });
        }

        // Show Register Modal
        if (registerBtn) {
            registerBtn.addEventListener('click', (e) => {
                e.preventDefault();
                authModal.style.display = 'flex';
                document.getElementById('registerForm').style.display = 'block';
                document.getElementById('loginForm').style.display = 'none';
                
                // Update active tab
                tabBtns.forEach(t => t.classList.remove('active'));
                document.querySelector('.tab-btn[data-tab="register"]').classList.add('active');
            });
        }

        // Select Role Functionality
        selectRoleBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const role = e.target.getAttribute('data-role');
                userRoleInput.value = role;
                regRoleInput.value = role;
                
                // Show auth modal with register form
                authModal.style.display = 'flex';
                document.getElementById('loginForm').style.display = 'none';
                document.getElementById('registerForm').style.display = 'block';
                
                // Show farmer fields if role is farmer
                farmerFields.style.display = role === 'farmer' ? 'block' : 'none';
                
                // Update active tab
                tabBtns.forEach(t => t.classList.remove('active'));
                document.querySelector('.tab-btn[data-tab="register"]').classList.add('active');
            });
        });

        // Sell Button (for farmers)
        if (sellBtn) {
            sellBtn.addEventListener('click', (e) => {
                e.preventDefault();
                authModal.style.display = 'flex';
                userRoleInput.value = 'farmer';
                regRoleInput.value = 'farmer';
                document.getElementById('loginForm').style.display = 'none';
                document.getElementById('registerForm').style.display = 'block';
                farmerFields.style.display = 'block';
                
                // Update active tab
                tabBtns.forEach(t => t.classList.remove('active'));
                document.querySelector('.tab-btn[data-tab="register"]').classList.add('active');
            });
        }

        // Tab Switching in Auth Modal
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.getAttribute('data-tab');
                
                // Update active tab
                tabBtns.forEach(t => t.classList.remove('active'));
                btn.classList.add('active');
                
                // Show corresponding form
                if (tab === 'login') {
                    document.getElementById('loginForm').style.display = 'block';
                    document.getElementById('registerForm').style.display = 'none';
                } else {
                    document.getElementById('registerForm').style.display = 'block';
                    document.getElementById('loginForm').style.display = 'none';
                }
            });
        });

        // Show Register Form
        if (showRegister) {
            showRegister.addEventListener('click', (e) => {
                e.preventDefault();
                document.getElementById('loginForm').style.display = 'none';
                document.getElementById('registerForm').style.display = 'block';
                
                // Update active tab
                tabBtns.forEach(t => t.classList.remove('active'));
                document.querySelector('.tab-btn[data-tab="register"]').classList.add('active');
            });
        }

        // Show Login Form
        if (showLogin) {
            showLogin.addEventListener('click', (e) => {
                e.preventDefault();
                document.getElementById('registerForm').style.display = 'none';
                document.getElementById('loginForm').style.display = 'block';
                
                // Update active tab
                tabBtns.forEach(t => t.classList.remove('active'));
                document.querySelector('.tab-btn[data-tab="login"]').classList.add('active');
            });
        }

        // Close Modal
        if (closeModal) {
            closeModal.addEventListener('click', () => {
                authModal.style.display = 'none';
            });
        }

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === authModal) {
                authModal.style.display = 'none';
            }
        });

        // Login Form Handler
        if (loginFormElement) {
            loginFormElement.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const email = document.getElementById('loginEmail').value;
                const password = document.getElementById('loginPassword').value;
                const role = document.getElementById('userRole').value;
                
                const users = JSON.parse(localStorage.getItem('users')) || [];
                const user = users.find(u => u.email === email && u.password === password);
                
                if (user) {
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    alert('Login successful!');
                    authModal.style.display = 'none';
                    
                    // Redirect based on role
                    if (user.isFarmer) {
                        window.location.href = 'farmer-dashboard.html';
                    } else {
                        window.location.href = 'products.html';
                    }
                } else {
                    alert('Invalid email or password');
                }
            });
        }

        // Register Form Handler
        if (registerFormElement) {
            registerFormElement.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const name = document.getElementById('regName').value;
                const email = document.getElementById('regEmail').value;
                const password = document.getElementById('regPassword').value;
                const confirmPassword = document.getElementById('regConfirmPassword').value;
                const phone = document.getElementById('regPhone').value;
                const address = document.getElementById('regAddress').value;
                const role = document.getElementById('regRole').value;
                const isFarmer = role === 'farmer';
                
                // Validate passwords match
                if (password !== confirmPassword) {
                    alert('Passwords do not match!');
                    return;
                }
                
                const users = JSON.parse(localStorage.getItem('users')) || [];
                
                // Check if email already exists
                if (users.some(u => u.email === email)) {
                    alert('Email already registered!');
                    return;
                }
                
                // Create user object
                const userData = {
                    id: 'user_' + Date.now(),
                    name,
                    email,
                    password,
                    phone,
                    address,
                    isFarmer,
                    createdAt: new Date().toISOString()
                };
                
                // Add farmer-specific fields if farmer
                if (isFarmer) {
                    userData.farmName = document.getElementById('regFarmName').value;
                    userData.location = document.getElementById('regLocation').value;
                    userData.verified = false; // Farmers need to be verified
                }
                
                // Save user to localStorage
                users.push(userData);
                localStorage.setItem('users', JSON.stringify(users));
                localStorage.setItem('currentUser', JSON.stringify(userData));
                
                alert(`Registration successful! ${isFarmer ? 'Your farmer account is pending verification.' : ''}`);
                authModal.style.display = 'none';
                
                // Redirect based on role
                if (isFarmer) {
                    window.location.href = 'farmer-dashboard.html';
                } else {
                    window.location.href = 'products.html';
                }
            });
        }

        // Social login buttons (demo only)
        if (googleLoginBtn) {
            googleLoginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                alert('Google login would be implemented here in a real app');
            });
        }

        if (facebookLoginBtn) {
            facebookLoginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                alert('Facebook login would be implemented here in a real app');
            });
        }

        // Update UI based on login status
        function checkAuth() {
            const currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
            
            if (currentUser) {
                if (loginBtn) loginBtn.style.display = 'none';
                if (registerBtn) registerBtn.style.display = 'none';
            } else {
                if (loginBtn) loginBtn.style.display = 'block';
                if (registerBtn) registerBtn.style.display = 'block';
            }
        }

        // Initialize auth check
        checkAuth();

        // Update UI based on login status
function checkAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const userDropdown = document.querySelector('.user-dropdown');
    
    if (currentUser) {
        if (loginBtn) loginBtn.style.display = 'none';
        if (registerBtn) registerBtn.style.display = 'none';
        if (userDropdown) {
            userDropdown.style.display = 'block';
            // Update user name and avatar
            const userName = document.querySelector('.user-name');
            const userAvatar = document.querySelector('.user-avatar');
            if (userName) userName.textContent = currentUser.name.split(' ')[0]; // First name only
            if (userAvatar) userAvatar.textContent = currentUser.name.charAt(0).toUpperCase();
        }
    } else {
        if (loginBtn) loginBtn.style.display = 'block';
        if (registerBtn) registerBtn.style.display = 'block';
        if (userDropdown) userDropdown.style.display = 'none';
    }
}

// Add this to the existing main.js file
// Logout functionality
document.addEventListener('click', function(e) {
    if (e.target && e.target.id === 'logoutBtn') {
        e.preventDefault();
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }
});